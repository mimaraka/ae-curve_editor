/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

(function () {
    'use strict';

    const csInterface = new CSInterface();

    function convertBezier(value) {
        if (!/^\s*$/.test(value)) {
            if (/^\s*cubic-bezier\s*\(\s*\-?\s*\d*\s*\.?\s*\d*\s*,\s*\-?\s*\d*\s*\.?\s*\d*\s*,\s*\-?\s*\d*\s*\.?\s*\d*\s*,\s*\-?\s*\d*\s*\.?\s*\d*\s*\)\s*$/.test(value)) {
                var cut1 = value.slice( 13 );
                var cut2 = cut1.slice( 0, -1 );
                var val_list = cut2.split(',');
                if (val_list[0] <= 0)
                    val_list[0] = 0.001;
                if (val_list[0] > 1)
                    val_list[0] = 1;
                if (val_list[3] < 0)
                    val_list[3] = 0;
                if (val_list[3] >= 1)
                    val_list[3] = 0.999;
                return val_list;
            }else return;
        }else return;
    }
    
    function init() {
        themeManager.init();
                
        $("#btn_test").click(function () {
            console.log("debug");
            var input_data = $('#bezier_input').val();
            var value = convertBezier(input_data);
            if (!value)
                alert("値を正しく入力してください");
            else
                csInterface.evalScript('applyToKeyframes('+ value[0] + ',' + value[1] + ',' + value[2] + ',' + value[3] +')');
        });
    }
        
    init();

}());
    
