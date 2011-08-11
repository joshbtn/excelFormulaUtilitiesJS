#includes
{exec} = require 'child_process'
fs = require 'fs'

#Globals
COMPILER_PATH = '/usr/share/java/compiler.jar'
VERSION = '0.9.1'
YEAR = (new Date).getFullYear
LICENSE =  fs.readFileSync './license.include', 'utf8'

console.log(LICENSE);
#tasks
task 'build', 'Building', ->
	exec "java -jar #{COMPILER_PATH} --compilation_level SIMPLE_OPTIMIZATIONS --js ./src/core.js --js ./src/ExcelFormulaUtilities.js  --js_output_file ./excelFormulaUtilities-#{VERSION}.min.js" , (err, stdout, stderr) ->
		throw err if err
		console.log stdout + stderr
		#after it's been compiled stick the license at the top
		exec "sed -i -e '1r ./license.include' -e '1{h; D;}' -e '2{p}' ./excelFormulaUtilities-#{VERSION}.min.js", (err, stdout, stderr) ->
			throw err if err
			console.log stdout + stderr
	exec 'docco ./src/*.js', (err, stdout, stderr) ->
		throw err if err
		console.log stdout + stderr
	exec "cat ./src/core.js ./src/ExcelFormulaUtilities.js > ./excelFormulaUtilities-#{VERSION}.js" , (err, stdout, stderr) ->
		throw err if err
		console.log stdout + stderr
	
