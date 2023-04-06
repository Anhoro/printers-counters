const db = require('./db');
const helper = require('../helper');
const config = require('../config');

/* fetch counters data from a single website and return counter */
async function getCounterFromWebsite(url, countersKeywords) {
  let counterOrMessage;
  try {
    /* fetch counters data from a single website */
    const websiteData = await helper.fetchWebsite(url);
    /* find and return located string `...${countersKeywords}...>999<...` from a full .html webpage */
    const locatedCounter = helper.locateCounter(websiteData, countersKeywords);
    if (locatedCounter === null)
      throw new Error('Could not find counter keyword \'' + countersKeywords + '\' on the MFP webpage. Check its webpage, a webpage language, or a keyword.');
    /* return a numbaer from a located string `...>999<...` */
    counterOrMessage = helper.getCounterFromString(locatedCounter);
  } catch(err) {
    console.log(err.message);
    counterOrMessage = err.message;
  }

  return counterOrMessage;
}

/* fetch counters data from a single website and return counter */
//async
async function getConsumableFromWebsite(device, deviceConsArr) {
  let consumableOrMessage = [];

  try {
    /* fetch counters data from a single website */
    //const websiteData = await helper.fetchWebsite(device.url);
    
    /*const websiteData = `<span class="x-fieldset-header-text" 
                         id="ext-gen1035">Xerox Black Print Cartridge</span></legend><div class="x-fieldset-bwrap" id="ext-gen1032"><div class="x-fieldset-body x-column-layout-ct" id="ext-gen1033" style="padding: 0px; height: auto;"><div class="x-column-inner" id="ext-gen1036" style="width: 650px;"><div id="ext-comp-1136" class="x-panel x-column" style="width: 162px;"><div class="x-panel-bwrap" id="ext-gen1038"><div class="x-panel-body x-panel-body-noheader" id="ext-gen1039" style="width: 162px;"><div id="ext-comp-1128" class="x-panel" style="padding-left: 15px;"><div class="x-panel-bwrap" id="ext-gen1042"><div class="x-panel-body x-panel-body-noheader" id="ext-gen1043" style="height: auto;"><div style="font-size:0px"><div class="x-column" style="width:25px"><div style="margin-bottom:18px;text-align:right;font:normal 10px arial,Helvetica,sans-serif;color:#000000">100%</div><div style="margin-bottom:18px;text-align:right;font:normal 10px arial,Helvetica,sans-serif;color:#000000">75%</div><div style="margin-bottom:18px;text-align:right;font:normal 10px arial,Helvetica,sans-serif;color:#000000">50%</div><div style="margin-bottom:18px;text-align:right;font:normal 10px arial,Helvetica,sans-serif;color:#000000">25%</div><div style="margin-bottom:18px;text-align:right;font:normal 10px arial,Helvetica,sans-serif;color:#000000">0%</div></div><div class="x-column" style="margin:4px 2px 2px 5px;width:9px"><div style="height:126px;width:9px; background:transparent url(images/sws/gage_meter.gif) no-repeat;"></div></div><div class="x-column" style="width:30px;"><div style="width: 30px;height: 5px;background: url(images/sws/cartridge_01.gif) no-repeat; "></div><div style="width: 30px;height: 130px;background: url(images/sws/cartridge_02.gif) repeat-y;"><div style="backgound:transparent;height:7.319999999999993px;"></div><div style="margin: 0px 3px 0px 4px;width: 23px;height: 2px;background: url(images/sws/black_01.gif) no-repeat;"></div><div style="margin: 0px 3px 0px 4px;width: 23px;background: url(images/sws/black_02.gif) repeat-y;height:114.68px;"></div><div style="margin: 0px 3px 0px 4px;width: 23px;height: 6px;background: url(images/sws/black_03.gif) no-repeat;"></div></div><div style="width: 30px;height: 5px;background: url(images/sws/cartridge_03.gif) no-repeat;"></div></div><div class="x-column" style="margin-left:5px;margin-top:7.319999999999993px;width:6x;"><img style="vertical-align:top;" src="./CentreWare Internet Services_files/arrow_01.gif"></div><div class="x-column" style="margin-left:3px;margin-top:7.319999999999993px;"><span style="font:bold 10px arial,Helvetica,sans-serif;color:#000000;line-height:10px;"> 94%</span></div><div class="x-clear"></div></div></div></div></div></div></div></div><div id="ext-comp-1137" class="x-panel x-column" style="width: 487px;"><div class="x-panel-bwrap" id="ext-gen1040"><div class="x-panel-body x-panel-body-noheader" id="ext-gen1041" style="width: 487px;"><fieldset id="ext-comp-1129" class=" x-fieldset x-fieldset-noborder x-form-label-left" style="padding: 0px;"><div class="x-fieldset-bwrap" id="ext-gen1044"><div class="x-fieldset-body x-fieldset-body-noheader x-fieldset-body-noborder" id="ext-gen1045" style="padding: 0px; height: auto;"><div class="x-form-item sws-fieldset-items-h1" tabindex="-1"><label for="ext-comp-1130" style="width:111px;padding-left:0px;width:111px;" class="x-form-item-label">Status:<span> &nbsp;&nbsp;&nbsp;</span></label><div class="x-form-element" id="x-form-el-ext-comp-1130" style="padding-left:116px"><div style="position:relative;height:22;" id="ext-gen1046" class=" sws-infofield"><input type="text" size="0" autocomplete="off" maxlength="1024" style="display: none; height: 22px;" id="ext-comp-1130" name="ext-comp-1130" class=" x-form-text x-form-field"><div id="ext-gen1047" style="height: 15px; position: absolute; left: 0px; top: 0px; padding: 3px 3px 3px 0px; background: transparent;">Ready</div></div></div><div class="x-form-clear-left"></div></div><div class="x-form-item sws-fieldset-items-h1" tabindex="-1"><label for="ext-comp-1131" style="width:111px;padding-left:0px;width:111px;" class="x-form-item-label">Remaining:<span> &nbsp;&nbsp;&nbsp;</span></label><div class="x-form-element" id="x-form-el-ext-comp-1131" style="padding-left:116px"><div style="position:relative;height:22;" id="ext-gen1051" class=" sws-infofield"><input type="text" size="0" autocomplete="off" maxlength="1024" style="display: none; height: 22px;" id="ext-comp-1131" name="ext-comp-1131" class=" x-form-text x-form-field">
                         <div id="ext-gen1052" style="height: 15px; position: absolute; left: 0px; top: 0px; padding: 3px 3px 3px 0px; background: transparent;">94 %</div></div></div><div class="x-form-clear-left"></div></div><div class="x-form-item sws-fieldset-items-h1" tabindex="-1"><label for="ext-comp-1132" style="width:111px;padding-left:0px;width:111px;" class="x-form-item-label">Impressions:<span> &nbsp;&nbsp;&nbsp;</span></label><div class="x-form-element" id="x-form-el-ext-comp-1132" style="padding-left:116px"><div style="position:relative;height:22;" id="ext-gen1056" class=" sws-infofield"><input type="text" size="0" autocomplete="off" maxlength="1024" style="display: none; height: 22px;" id="ext-comp-1132" name="ext-comp-1132" class=" x-form-text x-form-field"><div id="ext-gen1057" style="height: 15px; position: absolute; left: 0px; top: 0px; padding: 3px 3px 3px 0px; background: transparent;">209 Impressions</div></div></div><div class="x-form-clear-left"></div></div><div class="x-form-item sws-fieldset-items-h1" tabindex="-1"><label for="ext-comp-1133" style="width:111px;padding-left:0px;width:111px;" class="x-form-item-label">Capacity:<span> &nbsp;&nbsp;&nbsp;</span></label><div class="x-form-element" id="x-form-el-ext-comp-1133" style="padding-left:116px"><div style="position:relative;height:22;" id="ext-gen1061" class=" sws-infofield"><input type="text" size="0" autocomplete="off" maxlength="1024" style="display: none; height: 22px;" id="ext-comp-1133" name="ext-comp-1133" class=" x-form-text x-form-field"><div id="ext-gen1062" style="height: 15px; position: absolute; left: 0px; top: 0px; padding: 3px 3px 3px 0px; background: transparent;">3.0 K</div></div></div><div class="x-form-clear-left"></div></div><div class="x-form-item sws-fieldset-items-h1" tabindex="-1"><label for="ext-comp-1134" style="width:111px;padding-left:0px;width:111px;" class="x-form-item-label">Part Number:<span> &nbsp;&nbsp;&nbsp;</span></label><div class="x-form-element" id="x-form-el-ext-comp-1134" style="padding-left:116px"><div style="position:relative;height:22;" id="ext-gen1066" class=" sws-infofield"><input type="text" size="0" autocomplete="off" maxlength="1024" style="display: none; height: 22px;" id="ext-comp-1134" name="ext-comp-1134" class=" x-form-text x-form-field"><div id="ext-gen1067" style="height: 15px; position: absolute; left: 0px; top: 0px; padding: 3px 3px 3px 0px; background: transparent;">106R02777</div></div></div><div class="x-form-clear-left"></div></div><div class="x-form-item sws-fieldset-items-h1" tabindex="-1"><label for="ext-comp-1135" style="width:111px;padding-left:0px;width:111px;" class="x-form-item-label">Serial Number:<span> &nbsp;&nbsp;&nbsp;</span></label><div class="x-form-element" id="x-form-el-ext-comp-1135" style="padding-left:116px"><div style="position:relative;height:22;" id="ext-gen1071" class=" sws-infofield"><input type="text" size="0" autocomplete="off" maxlength="1024" style="display: none; height: 22px;" id="ext-comp-1135" name="ext-comp-1135" class=" x-form-text x-form-field"><div id="ext-gen1072" style="height: 15px; position: absolute; left: 0px; top: 0px; padding: 3px 3px 3px 0px; background: transparent;">CRUM-17050657747</div></div></div><div class="x-form-clear-left"></div></div></div></div></fieldset></div></div></div><div class="x-clear" id="ext-gen1037"></div></div></div></div></fieldset></div></div></div><div id="ext-comp-1152" class="x-panel x-column" style="width: 40px;"><div class="x-panel-bwrap" id="ext-gen1027"><div class="x-panel-body x-panel-body-noheader" id="ext-gen1028"><div id="ext-comp-1149" class="x-panel" style="padding: 1px; width: 10px;"><div class="x-panel-bwrap" id="ext-gen1076"><div class="x-panel-body x-panel-body-noheader" id="ext-gen1077"></div></div></div></div></div></div><div id="ext-comp-1153" class="x-panel x-column" style="width: 650px;"><div class="x-panel-bwrap" id="ext-gen1029"><div class="x-panel-body x-panel-body-noheader" id="ext-gen1030"><fieldset id="ext-comp-1138" class=" x-fieldset" style="margin-bottom: 0px;"><legend class="x-fieldset-header x-unselectable" id="ext-gen1078"><span class="x-fieldset-header-text" id="ext-gen1082">Black Imaging Unit</span></legend><div class="x-fieldset-bwrap" id="ext-gen1079"><div class="x-fieldset-body x-column-layout-ct" id="ext-gen1080" style="padding: 0px; height: auto;"><div class="x-column-inner" id="ext-gen1083" style="width: 650px;"><div id="ext-comp-1147" class="x-panel x-column" style="width: 162px;"><div class="x-panel-bwrap" id="ext-gen1085"><div class="x-panel-body x-panel-body-noheader" id="ext-gen1086" style="width: 162px;"><div id="ext-comp-1139" class="x-panel" style="padding-left: 15px;"><div class="x-panel-bwrap" id="ext-gen1089"><div class="x-panel-body x-panel-body-noheader" id="ext-gen1090" style="height: auto;"><div style="font-size:0px"><div class="x-column" style="width:25px"><div style="margin-bottom:18px;text-align:right;font:normal 10px arial,Helvetica,sans-serif;color:#000000">100%</div><div style="margin-bottom:18px;text-align:right;font:normal 10px arial,Helvetica,sans-serif;color:#000000">75%</div><div style="margin-bottom:18px;text-align:right;font:normal 10px arial,Helvetica,sans-serif;color:#000000">50%</div><div style="margin-bottom:18px;text-align:right;font:normal 10px arial,Helvetica,sans-serif;color:#000000">25%</div><div style="margin-bottom:18px;text-align:right;font:normal 10px arial,Helvetica,sans-serif;color:#000000">0%</div></div><div class="x-column" style="margin:4px 2px 2px 5px;width:9px"><div style="height:126px;width:9px; background:transparent url(images/sws/gage_meter.gif) no-repeat;"></div></div><div class="x-column" style="width:30px;"><div style="width: 30px;height: 5px;background: url(images/sws/imaging_01.gif) no-repeat; "></div><div style="width: 30px;height: 130px;background: url(images/sws/imaging_02.gif) repeat-y;"><div style="backgound:transparent;height:2.4399999999999977px;"></div><div style="margin: 0px 3px 0px 4px;width: 23px;height: 2px;background: url(images/sws/black_01.gif) no-repeat;"></div><div style="margin: 0px 3px 0px 4px;width: 23px;background: url(images/sws/black_02.gif) repeat-y;height:119.56px;"></div><div style="margin: 0px 3px 0px 4px;width: 23px;height: 6px;background: url(images/sws/black_03.gif) no-repeat;"></div></div><div style="width: 30px;height: 5px;background: url(images/sws/imaging_03.gif) no-repeat;"></div></div><div class="x-column" style="margin-left:5px;margin-top:2.4399999999999977px;width:6x;"><img style="vertical-align:top;" src="./CentreWare Internet Services_files/arrow_01.gif"></div><div class="x-column" style="margin-left:3px;margin-top:2.4399999999999977px;"><span style="font:bold 10px arial,Helvetica,sans-serif;color:#000000;line-height:10px;"> 98%</span></div><div class="x-clear"></div></div></div></div></div></div></div></div><div id="ext-comp-1148" class="x-panel x-column" style="width: 487px;"><div class="x-panel-bwrap" id="ext-gen1087"><div class="x-panel-body x-panel-body-noheader" id="ext-gen1088" style="width: 487px;"><fieldset id="ext-comp-1140" class=" x-fieldset x-fieldset-noborder x-form-label-left" style="padding: 0px;"><div class="x-fieldset-bwrap" id="ext-gen1091"><div class="x-fieldset-body x-fieldset-body-noheader x-fieldset-body-noborder" id="ext-gen1092" style="padding: 0px; height: auto;"><div class="x-form-item sws-fieldset-items-h1" tabindex="-1"><label for="ext-comp-1141" style="width:111px;padding-left:0px;width:111px;" class="x-form-item-label">Status:<span> &nbsp;&nbsp;&nbsp;</span></label><div class="x-form-element" id="x-form-el-ext-comp-1141" style="padding-left:116px"><div style="position:relative;height:22;" id="ext-gen1093" class=" sws-infofield"><input type="text" size="0" autocomplete="off" maxlength="1024" style="display: none; height: 22px;" id="ext-comp-1141" name="ext-comp-1141" class=" x-form-text x-form-field"><div id="ext-gen1094" style="height: 15px; position: absolute; left: 0px; top: 0px; padding: 3px 3px 3px 0px; background: transparent;">Ready</div></div></div><div class="x-form-clear-left"></div></div><div class="x-form-item sws-fieldset-items-h1" tabindex="-1"><label for="ext-comp-1142" style="width:111px;padding-left:0px;width:111px;" class="x-form-item-label">Remaining<img src="./CentreWare Internet Services_files/icon_common_help_16.gif" class="sws-quicktip" ext:qtip="Depend on user&#39;s job mode run length.">:<span> &nbsp;&nbsp;&nbsp;</span></label><div class="x-form-element" id="x-form-el-ext-comp-1142" style="padding-left:116px"><div style="position:relative;height:22;" id="ext-gen1098" class=" sws-infofield"><input type="text" size="0" autocomplete="off" maxlength="1024" style="display: none; height: 22px;" id="ext-comp-1142" name="ext-comp-1142" class=" x-form-text x-form-field"><div id="ext-gen1099" style="height: 15px; position: absolute; left: 0px; top: 0px; padding: 3px 3px 3px 0px; background: transparent;">98 %</div></div></div><div class="x-form-clear-left"></div></div><div class="x-form-item sws-fieldset-items-h1" tabindex="-1"><label for="ext-comp-1143" style="width:111px;padding-left:0px;width:111px;" class="x-form-item-label">Impressions:<span> &nbsp;&nbsp;&nbsp;</span></label><div class="x-form-element" id="x-form-el-ext-comp-1143" style="padding-left:116px"><div style="position:relative;height:22;" id="ext-gen1103" class=" sws-infofield"><input type="text" size="0" autocomplete="off" maxlength="1024" style="display: none; height: 22px;" id="ext-comp-1143" name="ext-comp-1143" class=" x-form-text x-form-field"><div id="ext-gen1104" style="height: 15px; position: absolute; left: 0px; top: 0px; padding: 3px 3px 3px 0px; background: transparent;">209 Impressions</div></div></div><div class="x-form-clear-left"></div></div><div class="x-form-item sws-fieldset-items-h1" tabindex="-1"><label for="ext-comp-1144" style="width:111px;padding-left:0px;width:111
                         px;" class="x-form-item-label">Capacity:<span> &nbsp;&nbsp;&nbsp;</span></label><divclass="x-form-element" id="x-form-el-ext-comp-1144" style="padding-left:116px"><div style="position:relative;height:22;" id="ext-gen1108" class=" sws-infofield"><input type="text" size="0" autocomplete="off" maxlength="1024" style="display: none; height: 22px;" id="ext-comp-1144" name="ext-comp-1144" class=" x-form-text x-form-field"><div id="ext-gen1109" style="height: 15px; position: absolute; left: 0px; top: 0px; padding: 3px 3px 3px 0px; background: transparent;">10.0 K</div></div></div><div class="x-form-clear-left"></div></div><div class="x-form-item sws-fieldset-items-h1" tabindex="-1"><label for="ext-comp-1145" style="width:111px;padding-left:0px;width:111px;" class="x-form-item-label">Part Number:<span> &nbsp;&nbsp;&nbsp;</span></label><div class="x-form-element" id="x-form-el-ext-comp-1145" style="padding-left:116px"><div style="position:relative;height:22;" id="ext-gen1113" class=" sws-infofield"><input type="text" size="0" autocomplete="off" maxlength="1024" style="display: none; height: 22px;" id="ext-comp-1145" name="ext-comp-1145" class=" x-form-text x-form-field"><div id="ext-gen1114" style="height: 15px; position: absolute; left: 0px; top: 0px; padding: 3px 3px 3px 0px; background: transparent;">101R00474</div></div></div><div class="x-form-clear-left"></div></div><div class="x-form-item sws-fieldset-items-h1" tabindex="-1"><label for="ext-comp-1146" style="width:111px;padding-left:0px;width:111px;" class="x-form-item-label">Serial Number:<span> &nbsp;&nbsp;&nbsp;</span></label><div class="x-form-element" id="x-form-el-ext-comp-1146" style="padding-left:116px"><div style="position:relative;height:22;" id="ext-gen1118" class=" sws-infofield"><input type="text" size="0" autocomplete="off" maxlength="1024" style="display: none; height: 22px;" id="ext-comp-1146" name="ext-comp-1146" class=" x-form-text x-form-field"><div id="ext-gen1119" style="height: 15px; position: absolute; left: 0px; top: 0px; padding: 3px 3px 3px 0px; background: transparent;">CRUM-17050657747</div></div></div><div class="x-form-clear-left"></div></div></div></div></fieldset></div></div></div><div class="x-clear" id="ext-gen1084"></div></div></div></div></fieldset></div></div></div><div class="x-clear" id="ext-gen1024"></div></div></div></div></div></form></div></div></div></div></div></div><div class="x-panel-bl x-panel-nofooter"><div class="x-panel-br"><div class="x-panel-bc"></div></div></div></div></div><iframe id="sws_portal_iframe_body" onload="SWS.UTIL.MenuMoveUnlock();" width="100%" height="100%" src="./CentreWare Internet Services_files/supplies.html" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="width: 0px; height: 0px;"> </iframe></div></div></div></div></div></div><div class="x-layout-split x-layout-split-west x-splitbar-h" id="ID_Portal_NaviPanel-xsplit" style="visibility: visible; left: 245px; top: 0px; height: 571px;">&nbsp;</div></div></div></div></div></div></div><div id="ext-comp-1009" class="x-panel x-border-panel x-panel-noborder" style="left: 0px; top: 677px; width: 1280px;"><div class="x-panel-bwrap" id="ext-gen22"><div class="x-panel-body x-panel-body-noheader x-panel-body-noborder" id="ext-gen23" style="height: 85px; width: 1280px;"><div id="ID_Portal_BotomPanel" class="x-panel x-panel-noborder" style="width: 1280px;"><div class="x-panel-bwrap" id="ext-gen32"><div class="x-panel-body x-panel-body-noheader x-panel-body-noborder x-border-layout-ct" id="ext-gen33" style="width: 1280px; height: 85px;"><div id="ID_Portal_Copyright" class="x-panel sws-copyright x-border-panel x-panel-noborder" style="width: 1280px; left: 0px; top: 0px;"><div class="x-panel-bwrap" id="ext-gen34"><div class="x-panel-body x-panel-body-noheader x-panel-body-noborder" id="ext-gen35" style="width: 1280px; height: 85px;">    <table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td width="2%">&nbsp;</td><td>&nbsp;</td></tr><tr><td width="2%">&nbsp;</td><td><img src="./CentreWare Internet Services_files/XeroxLogo.gif"></td></tr><tr><td width="2%">&nbsp;</td><td valign="middle">©2014 Xerox Corporation. All Rights Reserved. Xerox® and Design® are trademarks of Xerox Corporation in the United States and / or other countries.</td></tr></tbody></table></div></div></div><div id="ID_Portal_HiddenPanel" class="x-panel x-border-panel x-panel-noborder" style="left: 1280px; top: 0px; width: 0px;"><div class="x-panel-bwrap" id="ext-gen36"><div class="x-panel-body x-panel-body-noheader x-panel-body-noborder" id="ext-gen37" style="width: 0px; height: 85px;"></div></div></div></div></div></div></div></div></div></div></div></div><div id="sws_loading_wait" style="display: none;"><div><span>Loading... </span></div><div><img src="./CentreWare Internet Services_files/progress-bar_ani.gif"></div><div><span>CentreWare Internet Services</span></div></div><link rel="stylesheet" type="text/css" href="./CentreWare Internet Services_files/sws-all.css"><script type="text/javascript" src="./CentreWare Internet Services_files/ext-base.js.загрузка"></script><script type="text/javascript" src="./CentreWare Internet Services_files/ext-all.pjs"></script><script type="text/javascript" src="./CentreWare Internet Services_files/ext-override.js.загрузка"></script><script type="text/javascript" src="./CentreWare Internet Services_files/sws_data.js.загрузка"></script><script type="text/javascript" src="./CentreWare Internet Services_files/sws_language.js.загрузка"></script><script type="text/javascript" src="./CentreWare Internet Services_files/Utils.js.загрузка"></script><script type="text/javascript" src="./CentreWare Internet Services_files/ctform.js.загрузка"></script><script type="text/javascript" src="./CentreWare Internet Services_files/SWS_MenuTree.js.загрузка"></script><script type="text/javascript" src="./CentreWare Internet Services_files/SWS_Layout.js.загрузка"></script><script type="text/javascript" src="./Ce
                         ntreWare Internet Services_files/SWS_onReady.js.загрузка"></script><script>
      ум.. Черный тонер бла бла 55 5322  3 3 3 33 33лорем ип88сум,11]] 290d329d dw09dd 
      бла лем ипсум.. Принт-картридж (черный) бла бла лорем ипс32e eум.. бла бла лорем ипсум..,22]] ddf
      бла лрем ипсум.. small>Сборник отработанного тонера м32e 2eиeпсeум..б3ла бла лорем ипсум.. ,33]]ddf f
      бла лм ипсум.. Чистящий картридж бла бла лорем ипсум..бла бла лорем ипсум..бла small>OK<smalldf fff
      бла бла лорем ипсум..бла бла лорем ипсум.  бла бла лорем ипсум..бла бла лорем ипсум.  бла бла лорем ипсум..бла бла лорем ипсум.
      бла бла лорем ипсум..бла бла лорем ипсум.  бла бла лорем ипсум..бла бла лорем ипсум.  бла бла лорем ипсум..бла бла лорем ипсум.
      бла бла лорем ипсум..бла бла лорем ипсум. бла бла лорем ипсум..бла бла лорем ипсум. бла бла лорем ипсум..бла ла лорем ипсум.
    `;*/

    
    //console.log('try to reach ', device.urlCons);

    const websiteData = await helper.fetchWebsite(device.urlCons);

    console.log('websiteData');
    console.log(websiteData);

    for (let i = 0; i < deviceConsArr.length; i++) {
      if (deviceConsArr[i].keywords === '') continue;
      //console.log('keywords we are working now with: ', deviceConsArr[i].attrName);
      //console.log('consumable.keywords = ', deviceConsArr[i].keywords);

      /* find and return located string `...${deviceConsArr.keywords[j]}...99...` from a full .html webpage  */
      const locatedConsumable = locatedConsumableByModel(websiteData, 
                                                         device.manufacturer.model.title,
                                                         deviceConsArr[i].keywords);

      //todo: delete                                                         
      //console.log('locatedConsumable');
      //console.log(locatedConsumable);

      //
      // redo: do not throw error, try to look for another consumable
      //
      if (locatedConsumable === null)
        throw new Error('Could not find consumable keywords \'' + deviceConsArr[i].keywords + '\' on the MFP webpage. Check its webpage, a webpage language, or a keyword.');

      const regExp = calculatedRegExp(device.manufacturer.model.title, deviceConsArr[i].attrName);
      
      /* get a number from a located string `...>999<...` */
      deviceConsArr[i].value = helper.getConsumableFromString(locatedConsumable, regExp);
      
      //consumableOrMessage.push(helper.getConsumable4FromString(locatedConsumable));
      //console.log('consumable.value = ', deviceConsArr[i].value);
    };
  } catch(err) {
    console.log(err.message);
    consumableOrMessage = err.message;
  }

  //console.log('consumableOrMessage');
  //console.log(consumableOrMessage);
  /*deviceConsArr.forEach((consumable) => {
    console.log(consumable.attrName + ' - ' + 
    consumable.keywords + ' - ' + 
    consumable.value)
  });*/

  return deviceConsArr;
}

/* calculates a short string (for a different modelTitle) from websiteData
   that contains one of 4 consumable values we are looking now for*/
function locatedConsumableByModel(websiteData, modelTitle, consumableTitle) {
  let locatedConsumable;
  const escapedRegString = helper.escapedRegString(consumableTitle);
  
  console.log('we are searching for:');
  console.log(consumableTitle);

  switch(modelTitle) {
    case '3225':
      locatedConsumable = helper.locateCounter(websiteData, escapedRegString, 5120);
      break;
    case 'd95':
      locatedConsumable = helper.locateCounter(websiteData, escapedRegString);
      break;
  }

  return locatedConsumable;
}

/* prepare regular expression which is unique for different XEROX models */
function calculatedRegExp(modelTitle, consumableTitle) {
  let regExp;

  switch(modelTitle) {
    case '3225':
      regExp = />(\d+) %</;
      break;
    case 'd95':
      if (consumableTitle === 'wasteKeywords') {
        regExp = /small>(\w+)<\/small/;
      } else {
        regExp = /,(\d+)\]\]/;
      }
      break;
  }

  return regExp;
}

module.exports = {
  getCounterFromWebsite,
  getConsumableFromWebsite
}