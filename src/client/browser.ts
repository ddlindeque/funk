// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import {
    LanguageClient,
    LanguageClientOptions,
} from 'vscode-languageclient/browser';

let client: LanguageClient;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "funk" is now active! browser Edition');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('funk.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from funk! Browser edition');
    });

    context.subscriptions.push(disposable);

    let serverModule = vscode.Uri.joinPath(context.extensionUri, 'dist/server/server.js');

    //let serverOptions: ServerOptions = {
    //    run: { module: serverModule, transport: TransportKind.ipc },
    //    debug: {
    //        module: serverModule,
    //        transport: TransportKind.ipc
    //    }
    //};

    // Options to control the language client
    let clientOptions: LanguageClientOptions = {
        // Register the server for plain text documents
        documentSelector: [{ scheme: 'file', language: 'funk' }],
        synchronize: {
        }
    };

    //client = new LanguageClient(
    //    'funk',
    //    'funk Programming Language',
    //    serverOptions,
    //    clientOptions
    //);

    // Start the client. This will also launch the server
    client.start();


    try {
		const worker = new Worker(serverModule.toString());
		//worker.postMessage({ i10lLocation: l10n.uri?.toString(false) ?? '' });

        client = new LanguageClient('funk', 'funk Programming Language', clientOptions, worker);

        client.start();

        //client.start();

		//const newLanguageClient: LanguageClientConstructor = (id: string, name: string, clientOptions: LanguageClientOptions) => {
		//	return new LanguageClient(id, name, worker, clientOptions);
		//};

		//client = await startClient(context, newLanguageClient, { TextDecoder });

		//context.subscriptions.push(registerDropOrPasteResourceSupport({ language: 'css', scheme: '*' }));
	} catch (e) {
		console.log(e);
	}
}

// This method is called when your extension is deactivated
export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}