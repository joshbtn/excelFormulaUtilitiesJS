#includes
{exec} = require 'child_process'
http = require 'http'
fs = require 'fs'
querystring = require 'querystring'

#Globals
COMPILER_PATH = '/usr/share/java/compiler.jar'
VERSION = '0.9.1'
YEAR = (new Date).getFullYear
LICENSE =  fs.readFileSync './license.include', 'utf8'

#build
#------
#This is the offline build.  
#Requires: 
#  (mac, linux, cygwin(windows), minGW(windows)), node, npm, coffee-script, docco, and the google closure compiler.
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

#Build for cloud9IDE
#-------------------
#
#To get up and running on cloud9ide check out the wiki section.
#
task 'cloudBuild', 'Building in the cloud.', ->
    CORE_PATH = './src/core.js'
    EXCEL_FORMULA_UTILITIES_PATH = './src/ExcelFormulaUtilities.js'
    LICENSE_PATH = './license.include'
    DEV_BUILD_PATH = "./excelFormulaUtilities-#{VERSION}.js"
    PROD_BUILD_PATH = "./excelFormulaUtilities-#{VERSION}.min.js"
    
    fileLicense = fs.readFileSync(LICENSE_PATH, 'utf8')
    jsFileCore = fs.readFileSync(CORE_PATH, 'utf8')
    jsFileExcelFormulaUtilities = fs.readFileSync(EXCEL_FORMULA_UTILITIES_PATH, 'utf8')
    
    jsCode = jsFileCore + "\n" + jsFileExcelFormulaUtilities
    
    fs.writeFile DEV_BUILD_PATH, jsCode, 'utf8', (err)->
        console.log "Saved script to #{DEV_BUILD_PATH}"
    
    data = 
        'compilation_level': 'SIMPLE_OPTIMIZATIONS',
        'output_format' : 'text',
        'output_info' : 'compiled_code',
        'warning_level' : 'QUIET',
        'js_code' : jsCode
    
    query = querystring.stringify data
            
    headers =
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': query.length
    
    options = 
        'host': 'closure-compiler.appspot.com',
        'port': '80',
        'path': "/compile",
        'method': 'POST',
        'headers': headers

    req = http.request options, (res)-> 
        res.setEncoding('utf-8')
        jsCompiled =''
        
        
        res.on 'end', (e)->
            fs.writeFile PROD_BUILD_PATH, "#{fileLicense}\n#{jsCompiled}", 'utf8', (err)->
                if err?
                    throw err
                console.log "Saved compiled script to #{PROD_BUILD_PATH}"
        res.on 'data', (chunk)-> 
            jsCompiled += chunk
            
        
    req.on 'error', (e)->
        console.log('problem with request: ' + e.message);
    
    req.on 'close', (e)->
        console.log('end')
    
    req.write query
    req.end