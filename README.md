# migration-tools

A set of utilities and other helpers to kickstart content migration between and within Content Management Systems

Tools fall into two categories:

- **Utils**: In the `utils` directory you will find generic Typescript functions useful in migration scripts in general. These are
  not tied to any specific CMS
- **CMS Libraries**: In the `lib` directory you will find functions that are meant to solve specific problems relevant to
  particular CMS platforms

How to use:

Currently this library relies on `ts-node` to execute scripts. In the future it may use a CLI tool like `oclif`

1. Write your migration script in the `scripts` file, importing any tools into it.
2. To execute your script, run:

```shell
yarn ts-node src/script/<filename>
```

Alternatively, you can set it as a script in package.json and call it using the key

> Tip: Since most scripts rely on async calls, it's a good idea to capture your script logic in one async function, then call the
> function at the end
