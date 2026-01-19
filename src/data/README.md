# Data 目录

存放游戏数据的JSON文件。

## 文件列表

- `cards.json` - 记忆卡片数据
- `clues.json` - 线索词数据
- `config.json` - 游戏配置

## 数据格式示例

### cards.json
```json
[
  {
    "id": "card_001",
    "title": "卡片标题",
    "type": "memory",
    "content": "卡片内容...",
    "unlock_clue": "线索词",
    "new_clues": ["新线索1", "新线索2"]
  }
]
```

### clues.json
```json
{
  "initial_clues": ["初始线索1", "初始线索2"],
  "all_clues": ["所有线索词列表..."]
}
```
