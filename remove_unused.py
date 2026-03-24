import re

with open('/Users/skyman/UI/PC/application-market-react/src/UserProfile/index.tsx', 'r') as f:
    content = f.read()

functions_to_remove = [
    'renderBuyerDashboard',
    'renderBuyerOrders',
    'renderBuyerBills',
    'renderBuyerInvoices',
    'renderBuyerResources',
    'renderBuyerAnalysis',
    'renderBuyerSupport',
    'renderSellerDashboard',
    'renderSellerFinance',
    'renderSellerAnalysis',
    'renderSellerSupport',
    'renderSellerAssets',
    'renderSellerHealth'
]

for func in functions_to_remove:
    pattern = r'const ' + func + r' = \(\) => [({]'
    match = re.search(pattern, content)
    if not match:
        print(f'Not found: {func}')
        continue
    
    start_idx = match.start()
    
    stack = 0
    in_block = False
    end_idx = start_idx
    
    for i in range(start_idx, len(content)):
        if content[i] == '{':
            stack += 1
            in_block = True
        elif content[i] == '}':
            stack -= 1
            if in_block and stack == 0:
                end_idx = i + 1
                if end_idx < len(content) and content[end_idx] == ';':
                    end_idx += 1
                if end_idx < len(content) and content[end_idx] == '\n':
                    end_idx += 1
                break
                
    if end_idx > start_idx:
        print(f'Removing {func} from {start_idx} to {end_idx}')
        content = content[:start_idx] + content[end_idx:]

with open('/Users/skyman/UI/PC/application-market-react/src/UserProfile/index.tsx', 'w') as f:
    f.write(content)
