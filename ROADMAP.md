# Required
- Multipage should be handled in the Form observable

# Nice to haves

- Make sure the rules aren't set on construct() or in render functions, but everything in the static meta object, and make it a computed value on Field
- Transfer the submit function to Form, with only the parameter (isDraft = false) which handles everything. Drafts should only send up to the current page.
- Remove all obsolete parameters, and provide the formStore trough the mobx Provider.
- Implement semantic-release, and run yarn build on the CI.
- Implement mobx strict mode, and do everything with actions.
