import { Config as Configuration } from 'bili';

const configuration: Configuration = {
  banner: true,
  input: 'src/request.ts',
  output: {
    format: [
      'es',
      'cjs',
      'umd',
      'umd-min'
    ],
    moduleName: 'Request'
  },
  plugins: {
    'typescript2': {
      clean: true,
      tsconfig: './tsconfig.build.json',
      useTsconfigDeclarationDir: true
    }
  }
};

export default configuration;