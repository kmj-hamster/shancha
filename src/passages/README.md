# Passages 目录

存放所有游戏场景（Passage）的源文件。

## 文件格式

使用 Twee 格式（`.tw` 文件）：

```twee
:: PassageName [tags]
Passage内容...
<<set $variable = value>>
```

## 核心文件

- `StoryInit.tw` - 游戏初始化
- `Start.tw` - 起始界面
- `Main.tw` - 主游戏界面

## 命名规范

- 使用驼峰命名：`CardDisplay.tw`
- 功能明确：描述Passage的作用
