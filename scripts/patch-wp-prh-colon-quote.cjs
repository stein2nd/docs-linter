#!/usr/bin/env node
/**
 * textlint-rule-preset-wp-docs-ja の wordpress.yml に対する既知問題のパッチ。
 *
 * 1. コロン直後スペースと鉤括弧前スペース禁止の往復衝突
 *    「、。「」『』の前には半角スペースを入れない」→ `: 「` のスペースを削除して `:「` へ
 *    「コロンの後に半角スペースを入れる」→ `:「` を `: 「` へ
 *    コロン直後が鉤括弧・読点・句点・改行のいずれかのときはスペース挿入を行わないよう pattern を絞る。
 *
 * 2. 「の分」形式名詞ルールの除外漏れ
 *    `/の分([^散割類解野離析岐…])/` が「の分担」「の分母」「の分子」等にマッチし誤検出する。
 *    除外文字クラスに「担」「母」「子」を追加する。
 *
 * @see https://github.com/jawordpressorg/textlint-rule-preset-wp-docs-ja
 */
"use strict";

const fs = require("fs");
const path = require("path");

const pkg = "textlint-rule-preset-wp-docs-ja";
const rel = path.join("node_modules", pkg, "prh-rules", "wordpress.yml");
const target = path.resolve(__dirname, "..", rel);

if (!fs.existsSync(target)) {
  console.warn(`[docs-linter] ${rel} が無いため PRH パッチをスキップ`);
  process.exit(0);
}

let s = fs.readFileSync(target, "utf8");
let changed = false;

function applyPatch({ marker, needle, replacement, missingWarning, appliedMessage }) {
  if (s.includes(marker)) {
    return;
  }

  const idx = s.indexOf(needle);
  if (idx === -1) {
    console.warn(missingWarning);
    return;
  }

  s = s.slice(0, idx) + replacement + s.slice(idx + needle.length);
  changed = true;
  console.log(appliedMessage);
}

applyPatch({
  marker: "pattern: /:([^ \\n、。「」『』])/",
  needle: "  # コロンの後に半角スペースを入れる\n  - pattern: /:([^ ])/\n    expected: \": $1\"",
  replacement:
    "  # コロンの後に半角スペースを入れる（「『 等の直後は除外。鉤括弧前のスペース禁止と両立）\n" +
    "  - pattern: /:([^ \\n、。「」『』])/\n" +
    "    expected: \": $1\"",
  missingWarning:
    "[docs-linter] wordpress.yml の「コロンの後に半角スペース」ルールが見つからないためパッチをスキップ（上流 PRH の更新を確認）",
  appliedMessage: "[docs-linter] PRH: colon / quote 衝突回避パッチを適用しました"
});

const NOBUN_EXCLUDED_CHARS = "散割類解野離析岐担母子";
const nobunRuleBlock = (excludedChars) =>
  `  - pattern: /の分([^${excludedChars}])/\n    expected: のぶん$1`;

function applyNobunPatch() {
  const finalMarker = `pattern: /の分([^${NOBUN_EXCLUDED_CHARS}])/`;
  if (s.includes(finalMarker)) {
    return;
  }

  for (const variant of ["散割類解野離析岐担", "散割類解野離析岐"]) {
    const needle = nobunRuleBlock(variant);
    if (!s.includes(needle)) {
      continue;
    }
    s = s.replace(needle, nobunRuleBlock(NOBUN_EXCLUDED_CHARS));
    changed = true;
    console.log(
      "[docs-linter] PRH: 「の分担 / の分母 / の分子」誤検出回避パッチを適用しました"
    );
    return;
  }

  console.warn(
    "[docs-linter] wordpress.yml の「の分」形式名詞ルールが見つからないためパッチをスキップ（上流 PRH の更新を確認）"
  );
}

applyNobunPatch();

if (changed) {
  fs.writeFileSync(target, s, "utf8");
}
