// @ts-nocheck
import React, {useState, useEffect, useRef} from 'react';
import {arrayMove, SortableContainer, SortableElement} from "react-sortable-hoc";
import styled from 'styled-components';




import {
  Button, Tag, Radio, Drawer, Collapse
}from "antd"

import { AlignCenterRow} from "/imports/ui/common/AlignCenterRow";


import {
  ITagItem,
  ITreeMapConfig,
  ITreeMapLevelConfig,
  ITreeMapLevelNode,
  ISuggestLayout,
} from "../foam-treemap-def";


import {MultiBlockOnOff} from "../multi-tag-on-off/MultiBlockOnOff";
import {RowHolder} from "../single-field";
import {showSuggestLevelsDialog} from "../suggest-level-dialog";

const RadioGroup = Radio.Group;

const Holder = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: hidden;

  .contents {
    position: relative;
    overflow: hidden;
    flex: 1;
    .ant-drawer-wrapper-body {
      height: 100% !important;
      overflow-y: auto !important; 
      border: solid 1px #CCC;
    }

    #myTree {
      height: 100%;
      border: solid 1px #CCC;
    }
  }
`;

const SortableLevel = SortableElement(({value, onClose}) => {
  return (<Tag closable onClose={() => {
    onClose(value);
  }}>{value.label}</Tag>);
});


// @ts-ignore
const SortableLevels = SortableContainer(({items, onClose}) => {

  const itemViews = items.map((value:any, index:any) => {
    const key = `${value.value}-${index}`;
    // @ts-ignore
    return (<SortableLevel key={key} index={index} value={value} onClose={onClose}/>);
  });
  return (<div style={{display: 'inline-flex'}}>{itemViews}</div>);
});


const ApplyBarHolder = styled.div`
  padding: 4px;
  display: grid;
  grid-template-columns: auto auto 1fr;
  grid-gap: 20px;
  align-items: center;
`

function trySeparate8020(config: ITreeMapLevelConfig, level: number, result: any) {
  const {levelType} = config;
  const {groups} = result;

  groups.sort((a,b)=>{
    return b.weight-a.weight;
  });

  const totalWeight= groups.reduce((tw,g)=> {
    return tw+g.weight;
  },0);

  const totalWeight80=totalWeight*0.8;
  //---->
  const g80 =[];
  const g20 =[];
  let cw=0;
  let isOver80;
  groups.forEach((g)=>{
    if(isOver80){
      g20.push(g);
    }else {
      g80.push(g);
      cw+=g.weight;
      if(cw>totalWeight80){
        isOver80 = true;
      }
    }
  });
  const tw80= g80.reduce((tw,g)=> {
    return tw+g.weight;
  },0);

  const tw20= g20.reduce((tw,g)=> {
    return tw+g.weight;
  },0);

  //--->
  return [
    {
      id:`${levelType}-80-Lv.${level}`,
      label:`${levelType} 80% [${tw80}]`,
      weight: tw80,
      realWeight: tw80,
      groups:g80,
      levelType
    },
    {
      id:`${levelType}-20-Lv.${level}`,
      label:`${levelType} 20% [${tw20}]`,
      weight: tw20,
      realWeight: tw20,
      groups:g20,
      levelType
    }
  ];

}

function prepareDataObject(records: any[], levelConfigs: ITreeMapLevelConfig[], finalLevelProcessor: (record: any) => void) {

  if (levelConfigs.length === 0) {
    const groups = records.map((r) => {
      const rr = finalLevelProcessor(r);
      return rr;
    });
    const weight = groups.reduce((t, r) => {
      // @ts-ignore
      return t + r.realWeight; //TODO
    }, 0);
    return {
      weight: weight || 0.1,
      realWeight: weight,
      groups,
    };
  }


  const config = levelConfigs[0];
  const {path, fieldProcessor, levelType} = config;
  const _groupInfos: { [key: string]: Partial<ITreeMapLevelNode> } = {};
  const IdToItems: IListMap<any> = {};

  //---------------------------
  if(!fieldProcessor){

  }
  records.forEach((r) => {
    const belongs = fieldProcessor(path, r, levelType);
    //to support multi belong
    belongs.forEach((belong) => {
      const {id} = belong;
      _groupInfos[id] = belong;
      if (!IdToItems[id]) {
        IdToItems[id] = [];
      }
      IdToItems[id].push(r);
    });
  });
  //---------------------------
  const nextLevels = levelConfigs.slice(1);
  const groups = Object.keys(IdToItems).map((id) => {
    const subRecords = IdToItems[id];
    const summary = prepareDataObject(subRecords, nextLevels, finalLevelProcessor);
    const groupInfo = _groupInfos[id];
    const {realWeight} = summary;
    const {label} = groupInfo;
    let newLabel = label;
    if (!label.endsWith(")")) {
      newLabel = `${label}(${realWeight})`;
    }


    return {
      ...groupInfo, // id , label,
      ...summary,
      label: newLabel
    };
  });
  //-->do divide

  if(groups.length==1){
    return groups[0];
  }


  const weight = groups.reduce((t, r) => {
    return t + r.realWeight!;
  }, 0);

  const result = {
    weight: weight || 0.1,
    realWeight: weight,
    groups:groups,
  };
  if(result.groups.length>100){
    const newGroups=trySeparate8020(config,0,result);
    return {
      ...result,
      groups: newGroups
    }
  }
  return result;
}


interface IProps {
  domId?: string;
  records: any[];
  defaultFinalLevel: string;
  suggestLayouts: ISuggestLayout[],
  treeMapConfig: ITreeMapConfig
  beforeApply: (levels: ITagItem[], finalLevel: string) => boolean;
  maxGroupLevelsAttached?: number;
  onClickTreeGroup: (event) => boolean;
  renderDrawer?: (visible:boolean) => any;
  renderSelected?:()=>any;
  //--->
}


function GenericTreeMapSmall(props: IProps) {
  const {
    treeMapConfig, records, defaultFinalLevel,
    beforeApply, suggestLayouts,
  } = props;
  const domId = props.domId || "myTree"


  const initLevels =treeMapConfig.defaultLevels||[];
  const [levels, setLevels] = useState(initLevels);//treeMapConfig.levels.slice(0, 4)
  const [finalLevel, setFinalLevel] = useState(defaultFinalLevel); // or streamer
  const [layout, setLayout] = useState("ordered");

  const [drawerLv1Visible, setDrawerLv1Visible] = useState(false);
  const [selectedPreFilters, setSelectedPreFilters] = useState([]);

  const foamtreeRef = useRef();

  const [graph, setGraph] = useState(null);

  const toAttachRef = useRef([]);
  const [selectedGroup,setSelectedGroup ] = useState(null);
  const [topMostGroup,setTopMostGroup ] = useState(null);


  function handleOnModelChanged(dataObject) {

    if (!dataObject || !dataObject.groups) {
      return;
    }

    const toProcess = dataObject.groups.filter((g) => {
      return g.groups && g.groups.length > 0;
    });
    toAttachRef.current.push(toProcess);
  }

  function attachNext() {
    if (toAttachRef.current.length > 0) {

      window.requestAnimationFrame(() => {
        const start = Date.now();
        while (toAttachRef.current.length > 0 && (Date.now() - start < 16)) {
          var group = toAttachRef.current.shift();
          // @ts-ignore
          console.log(`attach on ${toAttachRef.current.length} - ${start}`);
          foamtreeRef.current.attach(group, 2);
        }
      });
    }
  }

  function startAttaching() {
    // @ts-ignore
    foamtreeRef.current.set("wireframeLabelDrawing", "always");
    attachNext();
  }


  function prepareShape(opts, groupProps) {
    const {group} = groupProps;

    const {polygonCenterX: cx, polygonCenterY: cy} = groupProps;
    let fx, fy;


    group.fullInformationRendered = groupProps.polygonArea >= 900;

    if (group.fullInformationRendered) {
      //render image and title
      fx = 0.5;
      fy = 1;
    } else {
      fx = 0.5;
      fy = 0.5;
    }
    group.fx = fx;
    group.fy = fy;
    const wToh = group.wToh;
    var widthToHeightRatio = wToh || 1;

    // @ts-ignore
    var iconBox = CarrotSearchFoamTree.geometry.rectangleInPolygon(
      groupProps.polygon,      // fit inside our main polygon
      cx, cy,             // the reference point is the polygon's center
      widthToHeightRatio,
      1,                // scale down by 20% to ensure some padding
      fx, fy              // pass the alignment of the reference point
    );
    group.iconBox = iconBox;

    if (group.fullInformationRendered) {
      // Compute how much height was left for the repository name.
      // This is the distance between the bottom edge of the polygon's box
      // and the bottom edge of the icon box we just computed.
      var heightLeftForName = groupProps.boxTop + groupProps.boxHeight - (iconBox.y + iconBox.h);

      // Lay out the repository name text.
      // Since we're only preparing the layout and not doing the actual drawing,
      // here we'll "draw" the label to a scratch buffer that the rendering function
      // will actually render.

      // Create and store the scratch buffer.
      group.nameCtx = groupProps.context.scratch();

      // Layout the text and "draw" it to the scratch buffer

      const lcx = cx;
      const lcy = iconBox.y + iconBox.h * 2;
      var nameLabelInfo = group.nameCtx.fillPolygonWithText(
        groupProps.polygon,               // lay out the text in the main polygon
        lcx,                          // center the text horizontally around the polygon's center
        lcy, // start the layout below the bottom edge of the icon //1.1
        groupProps.group.label,            // the text to lay out, the full repository name
        {
          verticalAlign: "bottom",      // flow the text downwards
          verticalPadding: 0.15,     // lower the default vertical padding
          fontFamily: opts.groupLabelFontFamily, // use the font family we set for the whole FoamTree
          // Limit the maximum total height of the text. Since the height is in relation
          // to the main polygon and we're actually fitting inside the bottom part of the polygon,
          // we need to compute what fraction of the total polygon height our text should fit.
          // We'll set to to 50% of the bottom part we designed to be left for the text.
          maxTotalTextHeight: 0.5 * heightLeftForName / groupProps.boxHeight,

          // If the geometry of the main polygon changes only sightly, we don't want to
          // re-layout the text (which is costly), but instead use the layout we already did.
          // To enable caching, we need to provide some cache object, which the text layout routine
          // use for its own purposes and the current area of the polygon.
          cache: group.cache,
          area: groupProps.polygonArea
        }
      );

      group.nameLabelInfo = nameLabelInfo; // remember the text layout parameters for rendering

      // If name does not fit, center the icon and stats vertically.
      // This will happen very rarely, if at all.
      /*
      if (!nameLabelInfo.fit) {
        debugger
        // @ts-ignore
        iconBox = CarrotSearchFoamTree.geometry.rectangleInPolygon(
          groupProps.polygon, cx, cy, widthToHeightRatio, 0.8, fx,
          0.5 // this time we center the icon box vertically
        );
        group.iconBox = iconBox;
      }
      */

      // Lay out the stats part (the top-right corner) into another scratch buffer
      group.statsCtx = groupProps.context.scratch();

      //group.statsCtx.lineWidth = 2;
      //
      // group.statsCtx.ctx.roundRect(iconBox.x,iconBox.y,iconBox.w,iconBox.h,0);
      //   //box.w + 2 * padding, box.h + 2 * padding, padding);


      // Draw the stats icons.
      /*
      var iconSize = isFirefox ? Math.round(iconBox.h * 0.35 / 2) * 2 : iconBox.h * 0.35;
      group.statsCtx.drawImage(eye,
        iconBox.x + iconBox.w * 1.2,  // put the icon to the right of the avatar icon box, with some extra padding
        iconBox.y + iconBox.h * 0.15, // the first row of stats
        iconSize, iconSize // size the stats icon based on the size of the avatar icon box
      );
      group.statsCtx.drawImage(fork,
        iconBox.x + iconBox.w * 1.3,
        iconBox.y + iconBox.h * 0.50, // the second row of stats
        iconSize, iconSize
      );
      */

      // "Draw" the stats numbers to the scratch buffer
      group.statsCtx.fillStyle = "black";
      group.statsCtx.font = iconBox.h * 0.20 + "px " + opts.groupLabelFontFamily;
      /*
      group.statsCtx.fillText(
        groupProps.group.item.watchers_count.toString(),
        iconBox.x + iconBox.w * 1.65,
        iconBox.y + iconBox.h * (0.15 + 0.25)
      );
      group.statsCtx.fillText(
        groupProps.group.item.forks_count.toString(),
        iconBox.x + iconBox.w * 1.65,
        iconBox.y + iconBox.h * (0.50 + 0.25)
      );*/
    }


  }

  function renderShape(groupProps) {

    const {polygonCenterX: cx, polygonCenterY: cy, group, context: ctx} = groupProps;
    var fx = group.fx, fy = group.fy;

    if (group.fullInformationRendered) {
      if (group.nameLabelInfo.fit) {
        if (group.nameLabelInfo.fontSize * groupProps.viewportScale >= 6) {
          // If the label fits and its font size is going to be legible,
          // draw the text we prepared earlier.
          group.nameCtx.replay(ctx);
        } else {
          // If the label fits, but the font would be too small at the
          // current zoom level, draw "dots" instead of the label.
          var box = group.nameLabelInfo.box;
          var dcx = box.x + box.w / 2;
          var dcy = box.y + box.h / 2;
          var dotSize = (box.w + box.h) / 40;
          var dotSize2 = dotSize / 2;
          var dotSpacing = dotSize * 3;
          ctx.fillRect(dcx - dotSize2, dcy - dotSize2, dotSize, dotSize);
          ctx.fillRect(dcx - dotSize2 - dotSpacing, dcy - dotSize2, dotSize, dotSize);
          ctx.fillRect(dcx - dotSize2 + dotSpacing, dcy - dotSize2, dotSize, dotSize);
        }
      }
      // Draw the stats
      group.statsCtx.replay(ctx);
    }

    // Draw the avatar image
    var iconBox = group.iconBox;

    if (group.image) {
      // If the image already loaded, fade-it in.
      // group.iconCrossFadeFrame--;
      // Vary the alpha based on the cross-fade animation progress
      // ctx.globalAlpha = 1 - group.iconCrossFadeFrame / iconCrossFadeFrames;
      // Draw the image
      ctx.drawImage(group.image, iconBox.x, iconBox.y, iconBox.w, iconBox.h);
      foamtreeRef.current.redraw(false, group);
    }

    // if (group.iconCrossFadeFrame > 0) {
    //   // Center of the spinner
    //   var ccx = cx + iconBox.w * (0.5 - fx);
    //   var ccy = cy + iconBox.h * (0.5 - fy);
    //   var spinnerRadius = iconBox.w * 0.25;
    //
    //   // Vary the alpha based on the cross-fade animation progress
    //   //ctx.globalAlpha = group.iconCrossFadeFrame / iconCrossFadeFrames;
    //
    //   // Draw the spinner
    //   var angle = 2 * Math.PI * (Date.now() % 1000) / 1000;
    //   ctx.beginPath();
    //   ctx.arc(ccx, ccy, spinnerRadius, angle, angle + Math.PI / 5, true);
    //   ctx.strokeStyle = "black";
    //   ctx.lineWidth = spinnerRadius * 0.3;
    //   ctx.stroke();
    //   // We draw the indicator animation only on fast devices
    //   // Increment the frame number and trigger another
    //   // redraw to keep the animation going.
    //   group.loadingAnimationFrame++;
    //   // Schedule redrawing of this group
    //   foamtreeRef.current.redraw(true, group);
    // }

  }

  function handleGroupSelectionChange(event) {
    const {group, selected} = event;

    if(!event.group.unselectable) {
      setSelectedGroup(group);
      setTopMostGroup(event.topmostClosedGroup);
      if(group!=event.topmostClosedGroup){

      }
    }


    //-->

    if (event.group.unselectable) {
      //event.preventDefault();
    }
    if (props.onClickTreeGroup) {
      const openDrawer=props.onClickTreeGroup(group);
      if(openDrawer){
        setDrawerLv1Visible(openDrawer);
      }
    }

  }




  function allocateFormTreeMap() {
    // @ts-ignore
    const foamtree = new CarrotSearchFoamTree({
      id: domId,
      fadeDuration: 1500,
      dataObject: {
        groups: [],
      },
      // Use a simple fading animation. Animated rollouts are very expensive for large hierarchies.
      rolloutDuration: 0,
      pullbackDuration: 0,
      // Don't use gradients and rounded cornrs for faster rendering.
      groupFillType: "plain",
      relaxationVisible: true,
      groupFillType: "plain", //for fast
      //maxGroupLevelsAttached: props.maxGroupLevelsAttached,
      groupContentDecoratorTriggering: "onSurfaceDirty",
      wireframeContentDecorationDrawing: "always",
      onModelChanging: function () {
        this.set("maxGroupLevelsAttached", 1);

      },
      onGroupClick: handleGroupSelectionChange,
    });
    foamtreeRef.current = foamtree;

  }


  function prepareLevelConfigs(): ITreeMapLevelConfig[] {
    const result: ITreeMapLevelConfig[] = levels.map((r) => {
      const level = r.value;
      const {levelPath, levelProcessors} = treeMapConfig;
      const path = levelPath[level] || [level];
      const fieldProcessor = levelProcessors[level];
      return {
        path, fieldProcessor, levelType: r.value
      }
    });
    return result;
  }

  function recaculateTree() {


    const levelConfigs = prepareLevelConfigs();

    const finalProcess = treeMapConfig.finalLevelProcessors[finalLevel];

    let currentRecords = records;
    if (selectedPreFilters.length > 0) {
      currentRecords = selectedPreFilters.reduce((rs, preFilter) => {

        const ll = preFilter.processor(rs);

        return ll;
      }, records);
    }

    const data = prepareDataObject(currentRecords, levelConfigs, finalProcess);
    const {groups} = data;
    setGraph(data);
    if (foamtreeRef.current) {
      // @ts-ignore
      foamtreeRef.current.set({
        dataObject: {groups},
        fadeDuration: 300,
        layout,
      });
    }

  }

  // @ts-ignore
  function groupColorDecorator(opts, props, vars) {

  }


  useEffect(() => {
    // @ts-ignore
    allocateFormTreeMap();
    return () => {

    };
  }, []);


  function onSortEnd({newIndex, oldIndex}) {
    const newLevels = arrayMove(levels, oldIndex, newIndex);
    setLevels(newLevels);
  }


  function handlePressRemoveLevel(target) {
    const newLevels = levels.filter((r) => {
      return r.value !== target.value;
    });
    setLevels(newLevels);
  }


  function renderLevels() {
    if (levels.length === 0) {
      return null;
    }
    return (
      <SortableLevels axis="x" lockAxis="x" items={levels} onSortEnd={onSortEnd} onClose={handlePressRemoveLevel}/>
    );
  }

  function renderLayoutSelector() {
    return (
      <RadioGroup onChange={(event) => {
        setLayout(event.target.value);
      }} value={layout}>
        <Radio value="relaxed">Relax</Radio>
        <Radio value="ordered">Ordered</Radio>
        <Radio value="squarified">Square</Radio>
      </RadioGroup>
    );
  }

  function renderFinalLevelSelector() {
    //finalLevel
    const {finalLevels} = treeMapConfig;
    const items = finalLevels.map((r) => {
      const {value, label} = r;
      return (<Radio value={value} key={value}>{label}</Radio>);
    })

    return (<RadioGroup onChange={(event) => {
      setFinalLevel(event.target.value);
    }} value={finalLevel}>
      {items}
    </RadioGroup>);
  }


  function renderLevelTag(item) {
    const {label} = item;
    return (<span>{label}</span>);
  }

  function renderLevelPicker2() {
    return (
      <MultiBlockOnOff items={treeMapConfig.levels} itemRender={renderLevelTag} values={levels} onUpdate={setLevels}/>);
  }


  function handlePressApply() {
    if (beforeApply) {
      if (beforeApply(levels, finalLevel)) {
        recaculateTree();
      }
    }
  }

  function handleSelectSuggest(data) {
    setLevels(data.levels);
    setFinalLevel(data.finalLevel);
  }

  function handlePressLoadPredefined() {
    // @ts-ignore
    showSuggestLevelsDialog({suggestLayouts, onOK: handleSelectSuggest});
  }

  function toggleDrawer() {
    setDrawerLv1Visible(!drawerLv1Visible);
  }

  function onCloseDrawer() {
    setDrawerLv1Visible(false);
  }

  function renderDrawer() {
    if (props.renderDrawer) {
      return (<Drawer
        placement="right"
        closable={true}
        width={"60%"}
        bodyStyle={{padding: 8}}
        onClose={onCloseDrawer}
        visible={drawerLv1Visible}
        getContainer={false}
        style={{position: 'absolute'}}
      >
        {props.renderDrawer(drawerLv1Visible)}
      </Drawer>);
    }
    return null;
  }

  return (
    <Holder>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header="Options" key="1" style={{marginBottom: 10}}>
          <RowHolder title={"Layout"} left={100}>
            <div style={{border: "solid 1px #CCC", padding: 4}}>
              {renderLayoutSelector()}
            </div>
          </RowHolder>

          <AlignCenterRow>
            <div>
              <div>
                <Button icon={"bulb"} size="small" onClick={handlePressLoadPredefined} type={"primary"}>Select
                  Predefined</Button>
              </div>
              <RowHolder title={"Sum up"} left={100}>
                <div style={{border: "solid 1px #CCC", padding: 4, width: 250}}>
                  {renderFinalLevelSelector()}
                </div>
              </RowHolder>
            </div>
            <div>
              <RowHolder title={"Available Levels"} size={"small"}>
                {renderLevelPicker2()}
              </RowHolder>
              <RowHolder title={"Levels"} wrap>
                {renderLevels()}
              </RowHolder>
            </div>
          </AlignCenterRow>
        </Collapse.Panel>
      </Collapse>
      <ApplyBarHolder>
        <Button type={"primary"} onClick={handlePressApply} style={{margin: 4}}>Apply</Button>
        {props.renderDrawer && (<Button type={"primary"} onClick={toggleDrawer}>Selected</Button>)}
        <div>
          {props.renderSelected?props.renderSelected():null}
        </div>
      </ApplyBarHolder>
      <div className={"contents"}>
        <div id={domId}/>
        {renderDrawer()}
      </div>
    </Holder>
  );
}


export default GenericTreeMapSmall;
