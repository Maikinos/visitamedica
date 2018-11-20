var aFilters1 = [];
var aFilters2 = [];
var aFilters3 = [];

var prevFilter1, prevFilter2, prevFilter3;
   
var oData = {
   
   cars : [
      {brand: "POLICLINICO SAN JOSE OBRERO", model: "MG", medico: "NORA ALVARADO PORTALINO"},
      {brand: "POLICLINICO EL PALMAR LO TILOS 108-201", model: "MG", medico: "DEMETRIO CARLOS ANCHANTE ANYARIN"},
      {brand: "POLICLINICO SAN JOSE OBRERO", model: "TRA", medico: "JEAN CARLOS CRIADO HUERTO"},
      {brand: "HOSPITAL SOLIDARIDAD SJM", model: "MG", medico: "VICTOR HUGO MATEO MONTALVO"},
      {brand: "HOSPITAL SOLIDARIDAD SJM", model: "MG", medico: "RODOLFO SUAREZ GUTIERREZ"},
      {brand: "CLÍNICA VIRGEN DEL ROSARIO", model: "NER", medico: "ELSA ZEGARRA OSORIO"},
      {brand: "HOSPITAL GERIATRICO MILITAR", model: "GER", medico: "MIGUEL ANGEL PACCO HUARAHUARA"}
   ],

   brands: [
      {name : "CLÍNICA VIRGEN DEL ROSARIO", key: "1"},
      {name : "POLICLINICO EL PALMAR LO TILOS 108-201", key: "2"},
      {name : "POLICLINICO SAN JOSE OBRERO", key: "3"},
      {name : "HOSPITAL SOLIDARIDAD SJM", key: "4"},
      {name : "CLÍNICA VIRGEN DEL ROSARIO", key: "5"},
      {name : "HOSPITAL GERIATRICO MILITAR", key: "6"}
   ],

   models: [
      {name : "MG", key: "1"},
      {name : "TRA", key: "2"},
      {name : "NER", key: "3"},
      {name : "GER", key: "4"}
   ],

   medicos: [
      {name : "NORA ALVARADO PORTALINO", key: "1"},
      {name : "DEMETRIO CARLOS ANCHANTE ANYARIN", key: "2"},
      {name : "JEAN CARLOS CRIADO HUERTO", key: "3"},
      {name : "VICTOR HUGO MATEO MONTALVO", key: "4"},
      {name : "RODOLFO SUAREZ GUTIERREZ", key: "5"},
      {name : "ELSA ZEGARRA OSORIO", key: "6"},
      {name : "MIGUEL ANGEL PACCO HUARAHUARA", key: "7"}
   ]                 
};


function calcFilter(oEvent, sFilterAtt, oFFL1, sFilterAtt1, oFFL2, sFilterAtt2) {
   var aSelectedItems = oEvent.getParameter("selectedItems");
   var aFilters = [];
   var aCrossFilters1 = [];
   var aCrossFilters2 = [];   

   for(var i=0; i<aSelectedItems.length; i++){
      var sFilterText = aSelectedItems[i].getText();
      aFilters.push(new sap.ui.model.Filter(sFilterAtt, sap.ui.model.FilterOperator.EQ, sFilterText));
      for(var j=0; j<oData.cars.length; j++){
         if (oData.cars[j][sFilterAtt] == sFilterText) {
            var sCrossFilterText1 = oData.cars[j][sFilterAtt1];
            var aCheckItems1 = oFFL1.getItems();
            var bCheckParam1 = false;
            for(var k=0; k<aCheckItems1.length; k++){
               sCheckText = aCheckItems1[k].getText();
               if (sCrossFilterText1 == sCheckText) {
                  bCheckParam1 = true;
               }
            }
            if (bCheckParam1 == true) {
               var oCrossFilter1 = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.EQ, sCrossFilterText1);
               aCrossFilters1.push(oCrossFilter1);
            }                       
            var sCrossFilterText2 = oData.cars[j][sFilterAtt2];
            var aCheckItems2 = oFFL2.getItems();
            var bCheckParam2 = false;
            for(var k=0; k<aCheckItems2.length; k++){
               sCheckText = aCheckItems2[k].getText();
               if (sCrossFilterText2 == sCheckText) {
                  bCheckParam2 = true;
               }
            }
            if (bCheckParam2 == true) {                     
               var oCrossFilter2 = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.EQ, sCrossFilterText2);
               aCrossFilters2.push(oCrossFilter2);
            }
         }
      }
   }
      
   return {filter: aFilters, crossFilters1: aCrossFilters1, crossFilters2: aCrossFilters2};
}







function applyFilter(oFFL1, oFFL2, aCrossFilters1, aCrossFilters2) {
   var aSaveSelectedKeys1 = oFFL1.getSelectedKeys();
   var aSaveSelectedKeys2 = oFFL2.getSelectedKeys();
   var aFilters = [].concat(aFilters1, aFilters2, aFilters3);
   oFFL1.getBinding("items").filter(aCrossFilters1);
   oFFL2.getBinding("items").filter(aCrossFilters2);
   oTable.getBinding('rows').filter(aFilters);           
   oFFL1.setSelectedKeys(aSaveSelectedKeys1 ? aSaveSelectedKeys1 : []);
   oFFL2.setSelectedKeys(aSaveSelectedKeys2 ? aSaveSelectedKeys2 : []); 
}




var oFacetFilter = new sap.ui.ux3.FacetFilter("myFacetFilter");

var oModel = new sap.ui.model.json.JSONModel();
oModel.setData(oData);
sap.ui.getCore().setModel(oModel);

var oItemTemplate = new sap.ui.core.ListItem({text:"{name}", key:"{key}"});

var oFFL1 = new sap.ui.ux3.FacetFilterList("ffl1", {
   title:"Instituciones",
   items : {path : "/brands", template : oItemTemplate}
});
oFFL1.attachSelect(function(oEvent) {
   aFilters1 = [];
      
   if(oEvent.getParameter("all")) {
      applyFilter(oFFL2, oFFL3, [], []);
      prevFilter1 = undefined;
      return;
   }

   // If a previous filter was already in place, we must unfilter first so that
   // the lists of check items in calcFilter contain all possible values.
   if(prevFilter1 && prevFilter1.length > 0) {
      applyFilter(oFFL2, oFFL3, [], []);
   }

   var oFilters = calcFilter(oEvent, "brand", oFFL2, "model", oFFL3, "medico");
   aFilters1 = oFilters.filter;
   prevFilter1 = oEvent.getParameter("selectedItems");
   applyFilter(oFFL2, oFFL3, oFilters.crossFilters1, oFilters.crossFilters2); 
});
oFacetFilter.addList(oFFL1);

var oFFL2 = new sap.ui.ux3.FacetFilterList("ffl2", {
   title:"Especialidades",
   multiSelect: true,
   items : {path : "/models", template : oItemTemplate}
});
oFFL2.attachSelect(function(oEvent) {
   aFilters2 = [];
      
   if(oEvent.getParameter("all")) {
      applyFilter(oFFL1, oFFL3, [], []);
      prevFilter2 = undefined;
      return;
   }

   // If a previous filter was already in place, we must unfilter first so that
   // the lists of check items in calcFilter contain all possible values.
   if(prevFilter2 && prevFilter2.length > 0) {
      applyFilter(oFFL1, oFFL3, [], []);
   }

   var oFilters = calcFilter(oEvent, "model", oFFL1, "brand", oFFL3, "medico");
   aFilters2 = oFilters.filter;
   prevFilter2 = oEvent.getParameter("selectedItems");
   applyFilter(oFFL1, oFFL3, oFilters.crossFilters1, oFilters.crossFilters2); 
});
oFacetFilter.addList(oFFL2);

var oFFL3 = new sap.ui.ux3.FacetFilterList("ffl3", {
   title:"Médicos",
   items : {path : "/medicos", template : oItemTemplate}
});
oFFL3.attachSelect(function(oEvent) {
   aFilters3 = [];
      
   if(oEvent.getParameter("all")) {
      applyFilter(oFFL1, oFFL2, [], []);
      prevFilter3 = undefined;
      return;
   }

   // If a previous filter was already in place, we must unfilter first so that
   // the lists of check items in calcFilter contain all possible values.
   if(prevFilter3 && prevFilter3.length > 0) {
      applyFilter(oFFL1, oFFL2, [], []);
   }

   var oFilters = calcFilter(oEvent, "medico", oFFL1, "brand", oFFL2, "model");
   aFilters2 = oFilters.filter;
   prevFilter3 = oEvent.getParameter("selectedItems");
   applyFilter(oFFL1, oFFL2, oFilters.crossFilters1, oFilters.crossFilters2); 
});
oFacetFilter.addList(oFFL3);

var oTable = new sap.ui.table.Table();
oTable.setTitle("");
oTable.addExtension(oFacetFilter);

var oControl = new sap.ui.commons.TextView().bindProperty("text", "brand");
oTable.addColumn(new sap.ui.table.Column({label: new sap.ui.commons.Label({text: "Instituciones"}), template: oControl, sortProperty: "brand", filterProperty: "brand"}));
oControl = new sap.ui.commons.TextView().bindProperty("text", "model");
oTable.addColumn(new sap.ui.table.Column({label: new sap.ui.commons.Label({text: "Especialidades"}), template: oControl, sortProperty: "model", filterProperty: "model"}));
oControl = new sap.ui.commons.TextView().bindProperty("text", "medico");
oTable.addColumn(new sap.ui.table.Column({label: new sap.ui.commons.Label({text: "Médicos"}), template: oControl, sortProperty: "medico", filterProperty: "medico"}));

oTable.bindRows("/cars");
oTable.placeAt("sample1");