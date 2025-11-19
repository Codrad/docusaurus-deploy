import os
from datetime import datetime

# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'OxidOS'
copyright = '2023, OxidOS Automotive SRL'
author = 'OxidOS Automotive SRL'

# The version info for the project you're documenting, acts as replacement for
# |version| and |release|, also used in various other places throughout the
# built documents.
#
# The short X.Y version.
version = "REQ-"+os.environ.get("VERSION", "0.0.0")+"-["+datetime.now().strftime("%d/%m/%Y %H:%M:%S")+"]"
# The full version, including alpha/beta/rc tags.
release = version

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = ['sphinxcontrib.plantuml',
              'sphinx_needs', 'sphinx_immaterial', "sphinxcontrib.jquery"]

templates_path = ['_templates']
exclude_patterns = []

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'sphinx_immaterial'
html_theme_options = {
    "palette": { "scheme": "default" }
}
html_static_path = ['_static']
html_css_files = ['css/strikethrough.css']

# The “title” for HTML documentation generated with Sphinx’s own templates.
if release is not None and release:
    html_title = project + " " + release +  " requirements"
else:
    html_title = project + " requirements"
# A shorter “title” for the HTML docs. This is used for links in the header and in the HTML Help docs.
html_short_title = project + " requirements"

# Requirements

needs_types = [dict(directive="req", title="Requirement", prefix="R_", color="#BFD8D2", style="node"),
               dict(directive="spec", title="Specification", prefix="S_", color="#FEDCD2", style="node"),
               dict(directive="impl", title="Implementation", prefix="I_", color="#DF744A", style="node"),
               dict(directive="test", title="Test Case", prefix="T_", color="#DCB239", style="node"),
               dict(directive="feature", title="Feature", prefix="F_", color="#FFCC00", style="node"),
               dict(directive="comp", title="Component", prefix="C_", color="#BFD8D2", style="node"),
               # Kept for backwards compatibility
               dict(directive="need", title="Need", prefix="N_", color="#9856a5", style="node")
           ]

needs_statuses = [dict(name="in work", description="Requirements are in the process of being written."),
                 dict(name="ready for review", description="Requirements have been written and are ready for review."),
                 dict(name="released", description="Requirements have been reviewed and approved."),
                 dict(name="rework", description="After the review discussion, when a requirement has a comment, its status changes to rework."),
                 dict(name="deleted", description="The requirements have been deleted."),
]

needs_extra_options = [ 'planned_release',
                        'verification_criteria', 
                       'verification_method', 
                       'asil', 
                       'implemented', 
                       'safety_relevant']

# PlantUML

on_rtd = os.environ.get('READTHEDOCS') == 'True'
if on_rtd:
    plantuml = 'java -Djava.awt.headless=true -jar /usr/share/plantuml/plantuml.jar'
else:
    plantuml = 'java -jar %s' % os.path.join(os.path.dirname(__file__), "utils", "plantuml.jar")

    plantuml_output_format = 'svg'
