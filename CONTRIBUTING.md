# Contributing to Kirboreo AI

Thank you for considering contributing to Kirboreo! This document provides guidelines and instructions for contributing to the project.

## 🤝 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Maintain professional communication
- Respect differing viewpoints and experiences

## 🚀 Getting Started

### 1. Fork the Repository
```bash
git clone https://github.com/YOUR_USERNAME/Kirboreo.git
cd Kirboreo
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment
Copy `.env.local` with your API keys:
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

### 4. Run Development Server
```bash
npm run dev
```

## 📝 Development Workflow

### Branch Naming Convention
- `feature/` - New features (e.g., `feature/add-watchlist`)
- `fix/` - Bug fixes (e.g., `fix/chart-rendering`)
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or updates

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add real-time stock alerts
fix: resolve chart data loading issue
docs: update API documentation
refactor: optimize Pinecone query logic
test: add integration tests for chat API
```

### Pull Request Process

1. **Create a feature branch**:
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**:
   - Write clean, commented code
   - Follow existing code style
   - Add tests for new features
   - Update documentation as needed

3. **Test your changes**:
```bash
npm run build
npm run test
npm run lint
```

4. **Commit and push**:
```bash
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

5. **Open a Pull Request**:
   - Provide a clear description
   - Reference related issues
   - Include screenshots for UI changes
   - Ensure all tests pass

## 🧪 Testing Guidelines

### Writing Tests
- Place tests in `__tests__/` directory
- Name test files: `*.test.ts` or `*.test.tsx`
- Aim for >80% code coverage for new features

### Running Tests
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure
```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interaction', () => {
    // Test implementation
  });
});
```

## 📐 Code Style

### TypeScript
- Use explicit types whenever possible
- Avoid `any` unless absolutely necessary
- Use interfaces for object shapes
- Prefer functional components for React

### React Components
```typescript
// Good
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick} className={styles[variant]}>{children}</button>;
}
```

### File Organization
- One component per file
- Co-locate styles with components (CSS Modules)
- Keep utility functions in `/lib`
- Extract reusable logic into hooks

## 🎨 UI/UX Guidelines

- Maintain consistent spacing (use CSS variables)
- Follow existing color scheme (cyan/purple gradient)
- Ensure responsive design (mobile-first)
- Add loading states for async operations
- Implement error boundaries

## 🔐 Security

### Never Commit:
- API keys or secrets
- `.env` files
- Personal data
- Sensitive configuration

### Best Practices:
- Validate user input
- Sanitize data before display
- Use environment variables for secrets
- Follow OWASP guidelines

## 📚 Documentation

### Code Comments
```typescript
/**
 * Fetches stock chart data from Yahoo Finance
 * @param ticker - Stock symbol (e.g., 'AAPL')
 * @param range - Time range ('1d', '5d', '1mo', '1y', etc.)
 * @returns Array of price data points
 */
export async function fetchStockChart(ticker: string, range: string) {
  // Implementation
}
```

### README Updates
- Update installation steps if adding dependencies
- Document new environment variables
- Add usage examples for new features

## 🐛 Reporting Bugs

### Bug Report Template
```
**Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen.

**Actual Behavior**
What actually happens.

**Environment**
- OS: [e.g., macOS 14]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.17.0]

**Screenshots**
If applicable, add screenshots.
```

## 💡 Feature Requests

### Feature Request Template
```
**Problem Statement**
Describe the problem or limitation.

**Proposed Solution**
How would you solve it?

**Alternatives Considered**
What other approaches did you consider?

**Additional Context**
Any other relevant information.
```

## 📞 Questions?

- Open a GitHub Discussion
- Contact: contact@kirboreo.com
- Review existing issues and PRs

## 🎯 Priority Areas

We're particularly interested in contributions for:

1. **Testing**: Expand test coverage
2. **Performance**: Optimize chart rendering
3. **Accessibility**: Improve ARIA labels and keyboard navigation
4. **Mobile UX**: Enhance responsive design
5. **Documentation**: Add examples and tutorials

## ✅ Checklist Before Submitting

- [ ] Code builds without errors (`npm run build`)
- [ ] All tests pass (`npm test`)
- [ ] No linter errors (`npm run lint`)
- [ ] Updated documentation (if needed)
- [ ] Added tests for new features
- [ ] Tested on different browsers/devices
- [ ] Followed commit message conventions
- [ ] PR description is clear and complete

---

Thank you for contributing to Kirboreo! 🚀

