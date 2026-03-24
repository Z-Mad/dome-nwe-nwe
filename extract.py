import re
import os

with open('src/UserProfile/index.tsx', 'r') as f:
    content = f.read()

# Find all renderXModal = () => ( ... ) or { return ... }
pattern = re.compile(r'const render([A-Za-z]+Modal)\s*=\s*\(\)\s*=>\s*({.*?};?\s*|.*?;\s*)', re.DOTALL)
matches = pattern.findall(content)
print(f"Found {len(matches)} modals")

