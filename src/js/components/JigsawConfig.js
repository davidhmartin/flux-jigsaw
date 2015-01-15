/*** @jsx React.DOM */

var React = require('react');
var JigsawStore = require('../stores/JigsawStore');
var TextInput = require('./TextInput');
var SliderInput = require('./SliderInput');
var SliderRangeInput = require('./SliderRangeInput');
var UndoButton = require('./UndoButton');
var RedoButton = require('./RedoButton');
var Randomizer = require('./Randomizer');

function getJigsawState() {
    return JigsawStore.getConfig();
}

/**
 * The panel for controlling the svg generator configuration values.
 */
var JigsawConfig = React.createClass({
  getInitialState: function() {
    return JigsawStore.getConfig();
  },

  componentDidMount: function() {
      JigsawStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    JigsawStore.removeChangeListener(this._onChange);
  },

  render: function() {
    return (
    <div>
      <h1>Configuration</h1>
<form>
<fieldset>
        <SliderInput attrName="gridWidth" label="Grid Width" maxVal={10} minVal={2} />
        <SliderInput attrName="gridHeight" label="Grid Height" maxVal={10} minVal={2} />
        <TextInput attrName="pixelWidth" placeholder="pixel width" label="Pixel Width"/>
        <TextInput attrName="pixelHeight" placeholder="pixel height" label="Pixel Height"/>
        <SliderInput attrName="tabProbability" label="Tab %" minVal={0} maxVal={1} step={.01}/>
        <SliderRangeInput minAttrName="tabLenFactorMin" maxAttrName="tabLenFactorMax" label="Tab Length" minVal={0} maxVal={.4} step={.01}/>
        <SliderRangeInput minAttrName="tabThicknessFactorMin" maxAttrName="tabThicknessFactorMax" label="Tab Thickness" minVal={0} maxVal={1} step={.01}/>
        <SliderRangeInput minAttrName="tabCurveFactorMin" maxAttrName="tabCurveFactorMax" label="Tab Curvature" minVal={0} maxVal={1} step={.01}/>
        <SliderRangeInput minAttrName="curveCtrlMin" maxAttrName="curveCtrlMax" label="Curvature" minVal={0} maxVal={.5} step={.01}/>
            <div>
        <Randomizer />
</div>
          <UndoButton />
          <RedoButton />
</fieldset>
</form>    
</div>
    );
  },

  _onChange: function() {
    this.setState(getJigsawState());
  }

});

module.exports = JigsawConfig;
