var esprima = require('esprima');
var escodegen = require('escodegen');

const deployTemplateFunctionName = 'deployTemplate';

// Generates NodeJs code for arm template deployment.
exports.deployTemplate = function deployTemplate() {
  var text = `function ${deployTemplateFunctionName}(credentials, callback){\
      \
      var subscriptionId;\
      var resourceGroupName;\
      var deploymentName;\
      var templateFilePath;\
      var templateParametersFilePath;\
      \
      var template = JSON.parse(fs.readFileSync(templateFilePath));\
      var templateParameters = JSON.parse(fs.readFileSync(templateParametersFilePath));\
      var parameters = {\
        template: template,\
        parameters: templateParameters,\
        mode: \'Complete\'\
      };\
      \
      var resourceClient = new ResourceManagement.ResourceManagementClient(credentials, subscriptionId);\
      resourceClient.deployments.createOrUpdate(resourceGroupName, deploymentName, parameters, callback);\
    }`;
    
    return generateCode(text);
};

exports.importsForDeployTemplate = function importsForDeployTemplate(){
  var requireStatements = [generateRequireStatement('fs'), 
                           generateRequireStatement('ResourceManagement', 'azure-arm-resource')];

  return requireStatements;
}

exports.deployTemplateCallSite = function deployTemplateCallSite() {
  var text = `${deployTemplateFunctionName}(credentials, function(err, result){ });`;
  return generateCode(text);
}

function generateRequireStatement(name, packageName){
  if(!packageName){
    packageName = name;
  }

  var text = `var ${name} = require('${packageName}');\r\n`;
  return text;
}

exports.generateNewLine = function generateNewLine() {
  return generateCode('\r\n');
}

// parse the text blob and emit code from the AST.
function generateCode(text) {
  var ast = esprima.parse(text);
  
  // TODO: configure code generation options (preserve newlines, tabspaces etc.)
  var code = escodegen.generate(ast);
  return code;
}
