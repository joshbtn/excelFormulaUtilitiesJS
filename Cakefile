{exec} = require 'child_process'
COMPILER_PATH = '/usr/share/java/compiler.jar'
VERSION = '0.9.1'

task 'build', 'Building', ->
	exec "java -jar #{COMPILER_PATH} --compilation_level SIMPLE_OPTIMIZATIONS --js ./src/core.js --js ./src/ExcelFormulaUtilities.js  --js_output_file ./excelFormulaUtilities-#{VERSION}.js" , (err, stdout, stderr) ->
		throw err if err
		console.log stdout + stderr
	exec 'docco ./src/*.js', (err, stdout, stderr) ->
		throw err if err
		console.log stdout + stderr
	
