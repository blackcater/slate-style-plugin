# Slate-Style-Plugin

*便于快捷生成行内样式的插件*

[English Doc.](./README.md)

## 用法

### 添加单个行内元素

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
    
`key`: 行内元素的快捷键, 值为`b`表示快捷键`Ctrl + B`.
`isShift`: 当`key`的值为`b`时，且该值为`true`, 则快捷键为`Ctrl + Shift + B`

### 添加多个行内元素

一些情况下，行内元素互相之间有互斥，不可以同时被使用。例如：字体大小和字体颜色。

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
