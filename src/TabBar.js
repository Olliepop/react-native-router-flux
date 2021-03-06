import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import DefaultRenderer from './DefaultRenderer';
import Actions from './Actions';
import TabNavigator from 'react-native-tab-navigator';
import { deepestExplicitValueForKey } from './Util';

class TabBar extends Component {

  static propTypes = {
    navigationState: PropTypes.object,
    tabIcon: PropTypes.any,
    onNavigate: PropTypes.func,
    tabBarStyle: View.propTypes.style,
    tabSceneStyle: View.propTypes.style,
  };

  onSelect(el) {
    if (!Actions[el.sceneKey]) {
      throw new Error(
        `No action is defined for sceneKey=${el.sceneKey} ` +
        `actions: ${JSON.stringify(Object.keys(Actions))}`);
    }

    /*
      If the prop `popChildrenOnSelect` is set to true on the tab child Scene,
      then pop all children in the stack to go back to the initial scene for
      this tab when it is selected again.
    */

    if (el.popChildrenOnSelect) {
     el.children.forEach((obj) => {
       Actions.pop();
     });
    }

    Actions[el.sceneKey]();
  }

  render() {
    const state = this.props.navigationState;
    const selected = state.children[state.index];
    const hideTabBar = deepestExplicitValueForKey(state, 'hideTabBar');

    const tabBarStyle = {};

    if (hideTabBar) {
      tabBarStyle.opacity = 0;
      tabBarStyle.height = 0;
    }

    return (
      <View
        style={{ flex: 1 }}
      >
        <TabNavigator
          tabBarStyle={[this.props.tabBarStyle, tabBarStyle]}
          sceneStyle={[{ paddingBottom: 0 }, this.props.tabSceneStyle]}
        >
          {state.children.map(el => {
            const isSelected = el.sceneKey === selected.sceneKey;
            const Icon = el.icon || this.props.tabIcon;
            return (
              <TabNavigator.Item
                key={el.key}
                selected={isSelected}
                title={el.tabTitle}
                renderIcon={() => <Icon {...this.props} {...el} />}
                renderSelectedIcon={() => <Icon {...this.props} {...el} selected />}
                onPress={() => this.onSelect(el)}
                tabStyle={el.tabStyle}
                titleStyle={el.tabTitleStyle}
                selectedTitleStyle={el.tabSelectedTitleStyle}
              >
                <DefaultRenderer
                  key={el.key}
                  onNavigate={this.props.onNavigate}
                  navigationState={el}
                />
              </TabNavigator.Item>
            );
          })}
        </TabNavigator>
      </View>
    );
  }

}

export default TabBar;
