# Ncobase Frontend

Console application and migration-era frontend packages for Ncobase.

The active console application is `apps/console`. Long-term shared frontend library work belongs in
the sibling `axis` repository; `packages/*` remains a migration reference unless a task explicitly
targets it.

## Documentation

- [Console Feature Matrix](docs/CONSOLE_FEATURE_MATRIX.md)
- [Feature Operation Spec](docs/FEATURE_OPERATION_SPEC.md)
- [UI/UX Rules](docs/UI_UX_RULES.md)

## Console Feature Exposure

Builder and Example routes are development/beta surfaces. They are enabled outside production by
default and hidden in production unless explicitly enabled:

```shell
VITE_ENABLE_BUILDER_ROUTES=true
VITE_ENABLE_EXAMPLE_ROUTES=true
```

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
