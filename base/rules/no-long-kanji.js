module.exports = function (context) {
  const { Syntax, RuleError, report, getSource } = context;
  return {
    [Syntax.Str](node) {
      const text = getSource(node);
      const matches = text.match(/[\p{Script=Han}]{7,}/gu);
      if (matches) {
        matches.forEach((match) => {
          report(node, new RuleError(`7文字以上の漢字が続いています: 「${match}」`));
        });
      }
    }
  };
};
