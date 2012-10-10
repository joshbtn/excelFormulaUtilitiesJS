#includes
{exec} = require 'child_process'
http = require 'http'
fs = require 'fs'
querystring = require 'querystring'

#Globals
VERSION = '0.9.4'
YEAR = (new Date).getFullYear
LICENSE =  fs.readFileSync './license.include', 'utf8'

COMPILER_PATH = './node_modules/closure-compiler/lib/vendor/compiler.jar'
DOCCO_PATH =  './node_modules/docco/lib/docco.js'
CORE_PATH = './src/core.js'
EXCEL_FORMULA_UTILITIES_PATH = './src/ExcelFormulaUtilities.js'
LICENSE_PATH = './license.include'
DEV_BUILD_PATH = "./excelFormulaUtilities-#{VERSION}.js"
PROD_BUILD_PATH = "./excelFormulaUtilities-#{VERSION}.min.js"

# build
#------
task 'build', 'Building', ->
    
    fileLicense = fs.readFileSync(LICENSE_PATH, 'utf8').toString().replace('#{VERSION}', "#{VERSION}").replace('#{YEAR}', (new Date()).getFullYear())
    jsFileCore = fs.readFileSync CORE_PATH, 'utf8'
    jsFileExcelFormulaUtilities = fs.readFileSync EXCEL_FORMULA_UTILITIES_PATH, 'utf8'
    
    jsCode = jsFileCore + "\n" + jsFileExcelFormulaUtilities
    
    # Write the js file
    fs.writeFile DEV_BUILD_PATH, jsCode, 'utf8', (err)->
        console.log "Saved script to #{DEV_BUILD_PATH}"
    
    #  Minify
    exec "java -jar #{COMPILER_PATH} --compilation_level SIMPLE_OPTIMIZATIONS --js ./src/core.js --js ./src/ExcelFormulaUtilities.js  --js_output_file ./excelFormulaUtilities-#{VERSION}.min.js" , (err, stdout, stderr) ->
        throw err if err
        cnosole.log stdout + stderr
        
    exec "node #{DOCCO_PATH} ./src/*.js", (err, stdout, stderr) ->
        throw err if err
        console.log stdout + stderr