/**
 * Slate-Style-Plugin
 *      便于添加行内样式功能
 *
 * @constructor
 */
/* eslint-disable consistent-return */
/* eslint-disable no-useless-escape */
const StylePlugin = {
  single: (style) => {
    if (!style.mark || !style.type) {
      throw new Error("`mark` and `type` properties should be included in first parameter!")
    }

    return {
      schema: { marks: { [style.type]: style.mark } },
      onKeyDown(event, data, state) {
        const isCtrl = style.isCtrl || false

        if (
          style.key === data.key &&
          data.isCmd &&
          data.isCtrl === isCtrl
        ) {
          event.preventDefault()

          return state
            .transform()
            .toggleMark(style.type)
            .apply()
        }
      },
    }
  },
  group: (styles) => {
    const schema = { marks: {} }
    const types = []

    for (let i = 0, len = styles.length; i < len; i++) {
      const style = styles[i]

      if (!style.mark || !style.type) {
        throw new Error("`mark` and `type` properties should be included in first parameter!")
      }

      schema.marks[style.type] = style.mark
      types.push(style.type)
    }

    return {
      schema,
      onKeyDown(event, data, state) {
        for (let i = 0, len = styles.length; i < len; i++) {
          const style = styles[i]
          const isCtrl = style.isCtrl || false

          if (
            style.key === data.key &&
            data.isCmd &&
            data.isCtrl === isCtrl
          ) {
            event.preventDefault()

            let transform = state.transform()

            for (let j = 0; j < len; j++) {
              transform = transform.removeMark(types[j])
            }

            return transform
              .addMark(style.type)
              .apply()
          }
        }
      },
    }
  },
}

/**
 * 变化 style 的快捷函数
 */
const toggleStyle = {
  single: (type, state, onChange) => {
    if (!state) {
      throw new Error("`state` parameter can\'t be Void!")
    }

    return (e) => {
      // 阻止默认事件
      e.preventDefault()

      const res = state
        .transform()
        .toggleMark(type)
        .apply()

      return onChange ? onChange(res) : res
    }
  },
  group: (types, state, onChange) => {
    if (!state) {
      throw new Error("`state` parameter can\'t be Void!")
    }

    return (type) => {
      if (!type) {
        throw new Error("`type` parameter can\'t be Void!")
      }

      return (e) => {
        e.preventDefault()

        let transform = state.transform()

        for (let i = 0, len = types.length; i < len; i++) {
          transform = transform.removeMark(types[i])
        }

        const res = transform
          .addMark(type)
          .apply()

        return onChange ? onChange(res) : res
      }
    }
  },
}

export default StylePlugin
export { toggleStyle }
