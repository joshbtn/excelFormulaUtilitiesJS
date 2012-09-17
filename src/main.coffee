
require './core'
require './ExcelFormulaUtilities'
xl = excelFormulaUtilities
module.exports =
  getTokens: (f) -> xl.getTokens(f).items
  toJavaScript: (f) -> xl.formula2JavaScript(f)
