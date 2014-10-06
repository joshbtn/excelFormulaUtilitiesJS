(function () {
    "use strict";
    
    window.addEventListener('load', function(){
        var isEu = window.document.getElementById("isEu");
        
        isEu.addEventListener('click', function(){
            window.excelFormulaUtilities.isEu = isEu.checked;
        });
        
    });
    
}())