# Changesets

This project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and publishing of packages.

## Configuration

The changesets configuration is defined in `.changeset/config.json`:

-   **Independent versioning**: Each package (indeks-tokens, indeks-utils, indeks-css, indeks-react) can have its own version number
-   **Fixed packages**: indeks-css and indeks-react are fixed - they will always be released with the same version number
-   **Linked packages**:
    -   indeks-tokens and indeks-utils are linked - when tokens change, utils should be updated
    -   indeks-utils and indeks-css are linked - when utils change, css should be updated
-   **Ignored packages**: indeks-docs, indeks-eksempel, and shared are not published (documentation and example apps)
-   **Access**: Public - packages will be published as public to npm

## Workflow

### 1. Making Changes

When you make changes that should trigger a release:

```bash
npm run changeset
```

This will prompt you to:

1. Select which packages were affected by your changes
2. Choose the semver bump type (major, minor, patch)
3. Write a summary of the changes (this will appear in CHANGELOG.md)

The changeset will be saved as a markdown file in `.changeset/`.

### 2. Version Bump Strategy

**Patch (0.0.X)** - Bug fixes, minor CSS tweaks

-   Fix button padding issue
-   Correct color variable reference
-   Update documentation

**Minor (0.X.0)** - New features, non-breaking changes

-   Add new component
-   Add new utility classes
-   Add new tokens
-   Update token values (if non-breaking)

**Major (X.0.0)** - Breaking changes

-   Remove or rename CSS classes
-   Change component APIs
-   Remove tokens
-   Change token structure

### 3. Package Change Frequency

Based on project requirements:

-   **indeks-tokens**: ~Monthly changes
-   **indeks-utils**: Infrequent changes
-   **indeks-css**: Frequent changes (multiple times per day)
-   **indeks-react**: Frequent changes (multiple times per day, fixed with indeks-css - always same version)

### 4. Dependency Cascade

When creating changesets, remember the dependency chain:

```
indeks-tokens (changes)
    → triggers indeks-utils update (linked)
        → triggers indeks-css update (linked)
            → triggers indeks-react update (fixed - same version as css)
```

**Important**: With the linked configuration, changesets will automatically prompt you to update dependent packages. You typically only need to create a changeset for the package you're directly changing.

**Example**: If you change a token:

1. Create changeset for indeks-tokens (minor)
2. Changesets will automatically prompt to update indeks-utils, indeks-css (because they're linked)
3. indeks-react will automatically get the same version as indeks-css (fixed)

### 5. Versioning and Publishing

On main branch, when ready to release:

```bash
# Create new versions and update CHANGELOGs
npm run version

# Build and publish to npm
npm run release
```

The `version` command will:

-   Consume all changesets
-   Update package.json versions
-   Update CHANGELOG.md files
-   Delete consumed changeset files

The `release` command will:

-   Build all packages
-   Publish changed packages to npm
-   Create git tags

## CI/CD Integration

In GitHub Actions, the workflow will:

1. Detect if there are changesets on main branch
2. Automatically run `changeset version` to bump versions
3. Run `changeset publish` to publish to npm
4. Create GitHub releases with changelog entries

## Examples

### Example 1: Daily CSS Component Update

```bash
npm run changeset
# Select: @sb1/indeks-css and @sb1/indeks-react (linked)
# Type: patch
# Summary: "Fix Card component border radius"
```

### Example 2: Monthly Token Update

```bash
npm run changeset
# Select: @sb1/indeks-tokens
# Type: minor
# Summary: "Update spacing scale to use new base size"
# Changesets will prompt for linked packages (utils, css) and fixed packages (react)
```

### Example 3: Utils-only Change

```bash
npm run changeset
# Select: @sb1/indeks-utils
# Type: patch
# Summary: "Add new utility classes for grid gap"
# Changesets will prompt for linked package (css) and fixed package (react)
```

### Example 4: Breaking Change

```bash
npm run changeset
# Select: @sb1/indeks-css
# Type: major
# Summary: "BREAKING: Rename .ix-btn to .ix-button"
# indeks-react will automatically get the same version (fixed)
```

## Tips

-   **Commit changesets with your PR**: Add the changeset files to your git commit
-   **One changeset per logical change**: Don't combine unrelated changes
-   **Clear summaries**: Write changelog entries that users will understand
-   **Test before publishing**: Always run `npm run build` before `npm run release`

---

For full documentation, visit [Changesets Repository](https://github.com/changesets/changesets)
