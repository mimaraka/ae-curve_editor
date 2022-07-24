/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/

function applyToKeyframes(x1, y1, x2, y2){
    try {
        const comp = app.project.activeItem;
        if (!comp) {
            alert("コンポジションを開いてください。");
            console.log("debug");
            return;
        }
        const props_selected = comp.selectedProperties;
        app.beginUndoGroup("Curve Editor:グラフの変更");
        for (var i = 0; i < props_selected.length; i++) {
            
            var key_indices = props_selected[i].selectedKeys;

            if (key_indices.length != 2) {
                alert("キーフレームを2つ選択してください。");
                return;
            }
            else if (key_indices[1] != key_indices[0] + 1) {
                alert("選択した2つのキーフレームの間に別のキーフレームが存在します。");
                return;
            }

            var dimension;

            if (props_selected[i].propertyValueType == PropertyValueType.ThreeD_SPATIAL ||
                props_selected[i].propertyValueType == PropertyValueType.ThreeD)
                dimension = 3;
            else if (props_selected[i].propertyValueType == PropertyValueType.TwoD_SPATIAL ||
                props_selected[i].propertyValueType == PropertyValueType.TwoD)
                dimension = 2;
            else
                dimension = 1;

            //成分ごとのキーフレームの値の差の配列の作成
            var key_value_range = Array(dimension);
            
            //キーフレームの時間差
            var key_interval = props_selected[i].keyTime(key_indices[1]) - props_selected[i].keyTime(key_indices[0]);
            //制御点ごとのスピード
            var speed_1 = Array(dimension);
            var speed_2 = Array(dimension);

            var easein = Array(dimension);
            var easeout = Array(dimension);
            var ease_array_in = [];
            var ease_array_out = [];

            //成分ごとにKeyframeEaseオブジェクトを作成し、要素数=dimensionの配列にぶち込む
            for(var j = 0; j < dimension - 2; j++) {
                if (dimension == 1) {
                    
                }
                key_value_range[j] = props_selected[i].keyValue(key_indices[1])[j] - props_selected[i].keyValue(key_indices[0])[j];
                speed_1[j] = key_value_range[j] * y1 / (key_interval * x1);
                speed_2[j] = key_value_range[j] * (1 - y2) / (key_interval * (1 - x2));
                easein[j] = new KeyframeEase(speed_2[j], (1 - x2) * 100);
                easeout[j] = new KeyframeEase(speed_1[j], x1 * 100);
                ease_array_in.push(easein[j]);
                ease_array_out.push(easeout[j]);
            }

            props_selected[i].setTemporalEaseAtKey(key_indices[0], ease_array_in, ease_array_out);
            props_selected[i].setTemporalEaseAtKey(key_indices[1], ease_array_in, ease_array_out);

        }
        app.endUndoGroup();
    }
    catch (error){
        alert(error);
}
}

