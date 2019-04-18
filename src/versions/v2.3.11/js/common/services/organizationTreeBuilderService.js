angular.module('verklizan.umox.mobile.common').service('organizationTreeBuilderService',
    function (supportingDataManager) {
        'use strict';

        // ============================
        // Private Fields
        // ============================
        var indexArray;
        var organizations;
        var hierarchyOrganizationTree;

        // ============================
        // Public Methods
        // ============================
        this.getOrganizationTreeView = function() {
            hierarchyOrganizationTree = supportingDataManager.getOrganizationsHierarchyTree();

            if (!hierarchyOrganizationTree) {
                return;
            }

            organizations = [];
            indexArray = 0;
            
            loopRecursive(hierarchyOrganizationTree, 0, [], 1);

            return organizations;
        }

        // ============================
        // Private Methods
        // ============================
        function UglyOrganization(original, idArray, depth) {
            this.Id = original.Id;
            this.Name = createDeepString(depth) + original.Name;
            this.IdArray = idArray;
            this.OriginalOrganisation = original;
        }

        function loopRecursive(object, deep, multiDimensionalArray, count) {
            multiDimensionalArray[0] = object.value.Id;
            organizations.push(new UglyOrganization(object.value, multiDimensionalArray, deep));
            var myIndex = indexArray; //My index in the array
            indexArray++;
            var isFirst = 0;
            for (var i = 0; i < object.children.length; i++) {
                if (object.children[i].value.IsScheme === false) { //filter
                    if (isFirst === 0) { deep++; count = 0; isFirst = 1; }
                    count++;
                    multiDimensionalArray[count] = []; //Im a higher number thus I do not exist (till here)
                    loopRecursive(object.children[i], deep, multiDimensionalArray[count], count);
                }
            }
            organizations[myIndex].IdArray = getFlatArray(multiDimensionalArray, []);
        }

        function createDeepString(deep) {
            var orgString = '';
            for (var i = 0; i < deep; i++) {
                orgString += '>'; 
            }
            return orgString;
        }

        function getFlatArray(multiDimensionalArray, returnArr) {
            returnArr.push(multiDimensionalArray[0]);
            for (var i = 1; i < multiDimensionalArray.length; i++) {
                getFlatArray(multiDimensionalArray[i], returnArr);
            }
            return returnArr;
        }
    }
);
