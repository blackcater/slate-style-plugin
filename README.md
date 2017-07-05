# Slate-Style-Plugin

*It is a plugin for generating inline-style formats conveniently.*

[中文文档](./README-CN.md)

## Usage

### Appending single value inline-style formats

```
import StylePlugin from 'slate-style-plugin'

const { single } = StylePlugin
const plugins = [
    single({
        type: 'bold',
        mark: props => <strong {...props.attributes}>{props.children}</strong>,
        key: 'b',
    })
]
```
    
`key`: shortcut key for inline-style format, value `b` means that the shortcut is `Ctrl + B`.
`isShift`: when the `key` value is `b`, the shortcut is `Ctrl + Shift + B`

### Appending multiple value inline-style formats

In some cases, some inline-style formats are mutually exclusive and can not be applied at the same time. For example the size of font and the color of font.

```
import StylePlugin from 'slate-style-plugin'
        
const { group } = StylePlugin
const plugins = [
    group([
        {
            type: "red",
            mark: props => <span {...props.attributes} style={{  color: "red"}}>{props.children}</span>,
            key: 'r',
        },
        {
            type: "blue",
            mark: props => <span {...props.attributes} style={{  color: "blue"}}>{props.children}</span>,
            key: 'b',
            isShift: true,
        }
    ])
]
```
