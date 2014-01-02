var storageUtils = {

    readRuleKeys: function (callback) {
        chromeAPI.sync.get("ruleKeys", function (data) {
            var ruleKeys = data.ruleKeys;
            if (_.isUndefined(ruleKeys)) {
                callback([]);
            } else {
                callback(ruleKeys);
            }
        });
    },

    updateRuleKeys: function (keys) {
        var callback = arguments.length > 1 ? arguments[1] : c.emptyCallback;

        this.readRuleKeys(function (exKeys) {
            chromeAPI.storage.set({"ruleKeys": _.uniq(exKeys.concat(keys))}, function () {
                chromeAPI.sync.set({"ruleKeys": _.uniq(exKeys.concat(keys))}, function () {
                    callback();
                });
            });
        });
    },

    toLocalRule: function (rule) {
        if (rule) {
            var localRule = {};

            localRule.id = rule.id;
            localRule.index = rule.index;
            localRule.value = rule.value;
            localRule.history = rule.history;

            return localRule;
        }
        return rule;
    },

    toSyncRule: function (rule) {
        if (rule) {
            var syncRule = {};

            syncRule.id = rule.id;
            syncRule.selector = rule.selector;
            syncRule.title = rule.title;
            syncRule.url = rule.url;
            syncRule.new = rule.new;
            syncRule.notify = rule.notify;
            syncRule.notified = rule.notified;

            return syncRule;
        }
        return rule;
    },

    rulesJsonToArray: function (ruleKeys, rulesJSON) {
        var rulesArr = [];
        _.each(ruleKeys, function (key) {
            rulesArr.push(rulesJSON[key]);
        });
        return rulesArr;
    },

    rulesArrayToJson: function (rulesArray) {
        var rulesJSON = {};

        _.each(rulesArray, function (rule) {
            var ruleJson = {};
            ruleJson[rule.id] = rule;
            $.extend(rulesJSON, ruleJson);
        });

        return rulesJSON;
    }
};