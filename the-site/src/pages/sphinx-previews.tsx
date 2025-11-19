import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import styles from './sphinx-previews.module.css';

interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

export default function SphinxPreviews() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch commits from sphinx-preview branch
    const commitsPromise = fetch('https://api.github.com/repos/Codrad/docusaurus-deploy/commits?sha=sphinx-preview&per_page=50')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch commits');
        return response.json();
      });

    // Fetch directory listing from gh-pages branch to see what actually exists
    const dirPromise = fetch('https://api.github.com/repos/Codrad/docusaurus-deploy/contents/sphinx-preview?ref=gh-pages')
      .then(response => {
        if (!response.ok) return [];
        return response.json();
      })
      .catch(() => []);

    Promise.all([commitsPromise, dirPromise])
      .then(([commitsData, dirData]) => {
        // Get list of existing SHAs from the directory
        const existingShas = new Set(
          Array.isArray(dirData) ? dirData.map((item: any) => item.name) : []
        );
        
        // Filter commits to only include those with deployed previews
        const filteredCommits = commitsData.filter((commit: Commit) => 
          existingShas.has(commit.sha)
        );
        
        setCommits(filteredCommits);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <Layout title="Sphinx Documentation Previews" description="Browse all available Sphinx documentation preview builds">
      <div className="container margin-vert--lg">
        <h1>Sphinx Documentation Previews</h1>
        <p>
          Each preview is generated automatically when changes are pushed to the <code>sphinx-preview</code> branch.
          Click on any preview below to view the documentation at that commit.
        </p>

        {loading && <p>Loading previews...</p>}
        {error && <p style={{color: 'red'}}>Error loading previews: {error}</p>}

        {!loading && !error && (
          <div className={styles.previewList}>
            {commits.map(commit => (
              <div key={commit.sha} className={styles.previewItem}>
                <h3>
                  <a 
                    href={`/docusaurus-deploy/sphinx-preview/${commit.sha}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Preview: {commit.sha.substring(0, 7)}
                  </a>
                </h3>
                <p className={styles.commitMessage}>{commit.commit.message}</p>
                <p className={styles.commitMeta}>
                  <span>Author: {commit.commit.author.name}</span>
                  <span> • </span>
                  <span>Date: {new Date(commit.commit.author.date).toLocaleString()}</span>
                </p>
                <p className={styles.previewUrl}>
                  <a 
                    href={`https://codrad.github.io/docusaurus-deploy/sphinx-preview/${commit.sha}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://codrad.github.io/docusaurus-deploy/sphinx-preview/{commit.sha}/
                  </a>
                </p>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && commits.length === 0 && (
          <p>No previews available yet. Push to the sphinx-preview branch to create one!</p>
        )}
      </div>
    </Layout>
  );
}
