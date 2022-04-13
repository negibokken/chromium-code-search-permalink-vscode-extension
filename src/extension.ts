// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "chromium-code-search-permalink" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('chromium-code-search-permalink.copy-permalink', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		let message: string;
		if(vscode.workspace.workspaceFolders !== undefined) {
		    let wf = vscode.workspace.workspaceFolders[0].uri.path ;
		    let f = vscode.workspace.workspaceFolders[0].uri.fsPath ;
			const editor = vscode.window.activeTextEditor;
		    let activeFilename = editor?.document.uri.fsPath;

			const reg = `^${wf}/`
			const regexp = new RegExp(reg)
			const filePath = activeFilename?.replace(regexp, '');

			const baseURL = "https://source.chromium.org/chromium/chromium/src"

			if (f.startsWith('vscode-remote://')) {
				f = f.replace(new RegExp('vscode-remote://[^/]+'),'')
			}

		    const headFile = f + "/.git/HEAD" ;
			let doc: vscode.TextDocument;
			try {
				doc = await vscode.workspace.openTextDocument(headFile);
			} catch (e) {
				vscode.window.showInformationMessage(`Please open directory that has .git directory as workspace. ${e}`);
				return;
			}
			const content = doc.getText()
			let branchOrTagName: string = content.startsWith('ref: refs/heads/') ?
        		content.replace(/^(ref: refs\/heads\/\.*)/, '').trim() :
				content.trim();


			const start = editor?.selection.start.line;
			const end = editor?.selection.end.line;

			let startEnd = "";
			if((!start && !end)||(!start && end)) {
				// Nop
			} else if(start && end) {
				if(start === end) {
					startEnd = `;l=${start+1}`;
				} else {
					startEnd = `;l=${start+1}-${end+1}`;
				}
			} else if(start && !end) {
				startEnd = `;l=${start+1}`;
			}
		
		    const path= `${baseURL}/+/${branchOrTagName}:${filePath}${startEnd}`;
			vscode.env.clipboard.writeText(path)
		    vscode.window.showInformationMessage(`Copied!: ${path}`);
		}
		else {
		    message = "YOUR-EXTENSION: Working folder not found, open a folder an try again" ;
		
		    vscode.window.showErrorMessage(message);
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
