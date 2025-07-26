import { createConfigForNuxt } from '@nuxt/eslint-config/flat';
import prettier from 'eslint-plugin-prettier';

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: false
  }
})
  .append({
    ignores: ['node_modules', '.nuxt', 'dist', '.output']
  })
  .append({
    plugins: { prettier },
    rules: {
      // 可以在這裡添加自定義規則
      'prettier/prettier': 'error'
    }
  });
