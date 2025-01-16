[![Open in GitHub Codespaces](https://github.com/ddlindeque/funk/blob/main/resources/codespaces.png)](https://codespaces.new/ddlindeque/funk?quickstart=1)

The *Programming Language* which is *pure functional*, allow *mutation* and have *operations*.

# Way forward!!!

* Create Web Extension using https://github.com/microsoft/vscode-extension-samples/tree/main/lsp-web-extension-sample
* Augment using https://github.com/ddlindeque/minimum-viable-vscode-language-server-extension



# Minimum Viable VS Code Language Server Extension

NOTE: This is heavily based on [lsp-sample from vscode-extension-samples][sample] with the goal of removing example-specific code to ease starting a new Language Server.

This project aims to provide a starting point for developing a self-contained Language Server Extension for VS Code using TypeScript.

"Self-contained" in this context means that this extension bundles its own language server code rather than wrapping an existing language server executable.

As an MVP, this omits

- linting
- testing
- behavior in the language server itself (besides connecting and listening to document changes)

## Getting Started

1. Clone this repo
2. Replace items in `package.json` marked `REPLACE_ME` with text related to your extension
3. Do the same for `client/package.json` and `server/package.json`
4. Do the same in `client/src/main.ts`
5. Run `npm install` from the repo root.

To make it easy to get started, this language server will run on _every_ file type by default. To target specific languages, change

`package.json`'s `activationEvents` to something like

```
"activationEvents": [
  "onLanguage:plaintext"
],
```

And change the `documentSelector` in `client/src/main.ts` to replace the `*` (e.g.)

```
documentSelector: [{ scheme: "file", language: "plaintext" }],
```

## Developing your extension

To help verify everything is working properly, we've included the following code in `server.ts` after the `onInitialize` function:

```typescript
documents.onDidChangeContent((change) => {
  connection.window.showInformationMessage(
    "onDidChangeContent: " + change.document.uri
  );
});
```

From the root directory of this project, run `code .` Then in VS Code

1. Build the extension (both client and server) with `⌘+shift+B` (or `ctrl+shift+B` on windows)
2. Open the Run and Debug view and press "Launch Client" (or press `F5`). This will open a `[Extension Development Host]` VS Code window.
3. Opening or editing a file in that window should show an information message in VS Code like you see below.

   ![example information message](https://semanticart.com/misc-images/minimum-viable-vscode-language-server-extension-info-message.png)

4. Edits made to your `server.ts` will be rebuilt immediately but you'll need to "Launch Client" again (`⌘-shift-F5`) from the primary VS Code window to see the impact of your changes.

[Debugging instructions can be found here][debug]

## Distributing your extension

Read the full [Publishing Extensions doc][publish] for the full details.

Note that you can package and distribute a standalone `.vsix` file without publishing it to the marketplace by following [these instructions][vsix].

## Anatomy

```
.
├── .vscode
│   ├── launch.json         // Tells VS Code how to launch our extension
│   └── tasks.json          // Tells VS Code how to build our extension
├── LICENSE
├── README.md
├── client
│   ├── package-lock.json   // Client dependencies lock file
│   ├── package.json        // Client manifest
│   ├── src
│   │   └── main.ts    // Code to tell VS Code how to run our language server
│   └── tsconfig.json       // TypeScript config for the client
├── package-lock.json       // Top-level Dependencies lock file
├── package.json            // Top-level manifest
├── server
│   ├── package-lock.json   // Server dependencies lock file
│   ├── package.json        // Server manifest
│   ├── src
│   │   └── server.ts       // Language server code
│   └── tsconfig.json       // TypeScript config for the client
└── tsconfig.json           // Top-level TypeScript config
```

[debug]: https://code.visualstudio.com/api/language-extensions/language-server-extension-guide#debugging-both-client-and-server
[sample]: https://github.com/microsoft/vscode-extension-samples/tree/main/lsp-sample
[publish]: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
[vsix]: https://code.visualstudio.com/api/working-with-extensions/publishing-extension#packaging-extensions

### Language Server

* Following [Documentation](https://code.visualstudio.com/api/language-extensions/overview)  
* [x] Implement basic syntax highlighter  
  The debugging instance does not update automatically - best I could do was to restart the whole session.
* [ ] Implement basic snippet completion
* [ ] Implement [basic syntax highlighting](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide)
* [ ] Implement [basic snippet completion](https://code.visualstudio.com/api/language-extensions/snippet-guide)
* [ ] Implement [basic language configuration](https://code.visualstudio.com/api/language-extensions/language-configuration-guide)
* [ ] Study [Programatic Language Features](https://code.visualstudio.com/api/language-extensions/overview#programmatic-language-features)

### Language Syntax

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**

# Test your Web Extension

https://code.visualstudio.com/api/extension-guides/web-extensions#test-your-web-extension-in-vscode.dev