var vscode = require('vscode');
var codegen = require('../codegen/codegen');

exports.createCommand = function createCommand() {
    vscode.commands.registerCommand('azure-node.template-deploy', function () {

      if(!vscode.window.activeTextEditor){
        vscode.window.showInformationMessage(`please open a .js file in the editor and then use this code generator command.`);
        return;
      }

      // generate code to be inserted.
      var imports = codegen.importsForDeployTemplate();
      var code = codegen.deployTemplate();

      vscode.window.activeTextEditor.edit((builder) => {
        // insert import statements
        for (var index = 0; index < imports.length; index++) {
          var importPos = new vscode.Position(index, 0);
          builder.insert(importPos, imports[index]);
        }

        // insert code
        const lineCount = vscode.window.activeTextEditor.document.lineCount;
        const range = new vscode.Range(new vscode.Position(lineCount, 0), new vscode.Position(lineCount + 1, 0));
        builder.replace(range, code);
      });

    });
};
