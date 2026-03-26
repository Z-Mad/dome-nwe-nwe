import re

with open('src/UserProfile/index.tsx', 'r') as f:
    content = f.read()

# Find the start of the renderers
start_str = "  // --- RENDERERS ---"
end_str = "  const handleConsoleModeChange = useCallback((mode: \"buyer\" | \"seller\") => {"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx + len(start_str)] + "\n\n" + content[end_idx:]
    with open('src/UserProfile/index.tsx', 'w') as f:
        f.write(new_content)
    print("Deleted inline modals successfully.")
else:
    print("Could not find start or end markers.")
