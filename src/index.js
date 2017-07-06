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
        const isShift = style.isShift || false

        if (
          style.key === data.key &&
          data.isCmd &&
          data.isCtrl === isCtrl &&
          data.isShift === isShift
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
          const isShift = style.isShift || false
          const isDefault = style.isDefault || false
          const hasMark = state.marks.some(mark => mark.type === style.type)

          if (
            style.key === data.key &&
            data.isCmd &&
            data.isCtrl === isCtrl &&
            data.isShift === isShift
          ) {
            event.preventDefault()

            let transform = state.transform()

            for (let j = 0; j < len; j++) {
              if (
                i === j &&
                hasMark &&
                !isDefault
              ) {
                transform = transform.toggleMark(types[j])
              } else if (
                i === j &&
                !hasMark &&
                !isDefault
              ) {
                transform = transform.addMark(types[j])
              } else {
                transform = transform.removeMark(types[j])
              }
            }

            return transform
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

    return (type, isDefault = false) => {
      if (!type) {
        throw new Error("`type` parameter can\'t be Void!")
      }

      return (e) => {
        e.preventDefault()

        const hasMark = state.marks.some(mark => mark.type === type)
        let transform = state.transform()

        for (let i = 0, len = types.length; i < len; i++) {
          if (
            type === types[i] &&
            hasMark &&
            !isDefault
          ) {
            transform = transform.toggleMark(types[j])
          } else if (
            type === types[i] &&
            !hasMark &&
            !isDefault
          ) {
            transform = transform.addMark(types[j])
          } else {
            transform = transform.removeMark(types[j])
          }
        }

        const res = transform
          .apply()

        return onChange ? onChange(res) : res
      }
    }
  },
}

export default StylePlugin
export { toggleStyle }
