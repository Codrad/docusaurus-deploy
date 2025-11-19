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

interface Preview {
  name: string;
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
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch directory listing from gh-pages branch to see what actually exists
    fetch('https://api.github.com/repos/Codrad/docusaurus-deploy/contents/sphinx-preview?ref=gh-pages')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch preview directories');
        return response.json();
      })
      .then(dirData => {
        if (!Array.isArray(dirData)) {
          setPreviews([]);
          setLoading(false);
          return;
        }
        
        // Get version directories (v-1, v-2, etc.)
        const versionDirs = dirData
          .filter((item: any) => item.type === 'dir' && item.name.startsWith('v-'))
          .map((item: any) => ({
            name: item.name,
            sha: '', // We'll set this if needed
            commit: {
              message: `Preview ${item.name}`,
              author: {
                name: 'GitHub Actions',
                date: new Date().toISOString()
              }
            }
          }))
          .sort((a, b) => {
            // Sort by version number descending (newest first)
            const aNum = parseInt(a.name.replace('v-', ''));
            const bNum = parseInt(b.name.replace('v-', ''));
            return bNum - aNum;
          });
        
        setPreviews(versionDirs);
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
            {previews.map(preview => (
              <div key={preview.name} className={styles.previewItem}>
                <h3>
                  <a 
                    href={`/docusaurus-deploy/sphinx-preview/${preview.name}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Preview: {preview.name}
                  </a>
                </h3>
                <p className={styles.commitMessage}>{preview.commit.message}</p>
                <p className={styles.commitMeta}>
                  <span>Build: {preview.name}</span>
                </p>
                <p className={styles.previewUrl}>
                  <a 
                    href={`https://codrad.github.io/docusaurus-deploy/sphinx-preview/${preview.name}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://codrad.github.io/docusaurus-deploy/sphinx-preview/{preview.name}/
                  </a>
                </p>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && previews.length === 0 && (
          <p>No previews available yet. Push to the sphinx-preview branch to create one!</p>
        )}
      </div>
    </Layout>
  );
}
