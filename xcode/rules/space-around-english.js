// xcode/rules/space-around-english.js
// ============================================================
// カスタムルール: 英単語周りのスペースチェック
// ------------------------------------------------------------
// このルールは textlint-rule-preset-swift-docs-ja と併用されます。
// 必要に応じて、プリセットのルールと重複する場合は削除を検討してください。
// ============================================================
"use strict";

module.exports = function(context) {
  const { Syntax, RuleError, report, getSource } = context;

  return {
    [Syntax.Str](node) {
      const text = getSource(node);

      // 英単語（A-Z, a-z, 数字を含む場合）を検出
      const regex = /([^\sA-Za-z0-9])([A-Za-z]+)([^\sA-Za-z0-9])/g;

      let match;
      while ((match = regex.exec(text)) !== null) {
        const before = match[1];
        const word = match[2];
        const after = match[3];
        const index = match.index + before.length;

        // スペース不足の場合に警告
        report(
          node,
          new RuleError(`「${before}${word}${after}」の前後に半角スペースを入れてください。`, {
            index
          })
        );
      }
    }
  };
};
