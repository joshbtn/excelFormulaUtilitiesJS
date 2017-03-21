(function() {
  "use strict";
  window.addEventListener('load', function() {
    var isEu = window.document.getElementById("isEu");
    isEu.addEventListener('click', function() {
      window.excelFormulaUtilities.isEu = isEu.checked;
    });
  });

  function selectText(container) {
    if (document.selection) {
      var range = document.body.createTextRange();
      range.moveToElementText(container);
      range.select();
    } else if (window.getSelection) {
      window.getSelection().empty()
      var range = document.createRange();
      range.selectNode(container);
      window.getSelection().addRange(range);
    }
  }

  var clipboard = new Clipboard('#copyFormulaBtn', {
    text: function(trigger) {
        return document.getElementById('fomatFormula_2_out').innerHtml;
    }
  });

  clipboard.on('success', function(e) {
    e.clearSelection();
  });

  clipboard.on('error', function(e) {
  });


}());
