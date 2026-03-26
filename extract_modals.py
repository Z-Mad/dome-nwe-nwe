import re
import os

with open('src/UserProfile/index.tsx', 'r') as f:
    content = f.read()

# This is a bit complex because the modals are rendered as inline JSX functions.
# Let's just create the files manually to ensure correct imports.
