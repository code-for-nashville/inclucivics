import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class Legend extends Component {
  state = {

  }
  static propTypes = {
    data: PropTypes.array.isRequired, // TODO: Define structure
    onFilterAdd: PropTypes.func.isRequired,
    onFilterRemove: PropTypes.func.isRequired
  }

  handleItemChange = (name) => (event) => {
    const {
      onFilterAdd,
      onFilterRemove
    } = this.props

    if (event.target.checked) return onFilterRemove(name)
    onFilterAdd(name)
  }

  render () {
    const {
      data
    } = this.props

    const items = data.map(d => (
      <LegendItem
        name={d.name}
        key={d.name}
        checked={d.checked}
        onChange={this.handleItemChange(d.name)}
      />
    ))

    return (
      <div>{items}</div>
    )
  }
}

class LegendItem extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    name: PropTypes.string,
    checked: PropTypes.bool
  }

  render () {
    const {
      onChange,
      name,
      checked
    } = this.props

    return (
      <div>
        <input
          onChange={onChange}
          type='checkbox'
          checked={checked} />
        <span>{name}</span>
      </div>
    )
  }
}
