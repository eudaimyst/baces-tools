console.log('lets decompile the units');

/**
 * 
 * Following is an example UnitDefinition_ file
 * We want to extract the important data from it
 * 
%YAML 1.1
%TAG !u! tag:unity3d.com,2011:
--- !u!114 &11400000
MonoBehaviour:
  m_ObjectHideFlags: 0
  m_CorrespondingSourceObject: {fileID: 0}
  m_PrefabInstance: {fileID: 0}
  m_PrefabAsset: {fileID: 0}
  m_GameObject: {fileID: 0}
  m_Enabled: 1
  m_EditorHideFlags: 0
  m_Script: {fileID: 11500000, guid: 83db28d474ddf34fc6498defdcda0d4f, type: 3}
  m_Name: UnitDefinition_Blink
  m_EditorClassIdentifier:
  UnitRadius: 0.9
  UnitType:
    _id: 42
  DisplayOrder: 7
  _castType: 2
  _unitPlacementRules:
    _placementRadius: 0
    _validPlacementRadius:
      Infinite: 0
      _value: 0.25
    _randomRotationRangeDeg: 0
    _validColor: 1
    _invalidPlacementColor: 2
    _insufficientResourcesColor: 3
    _previewPrefab: {fileID: 0}
  _resourceCost:
    _healthPercent: 0
    _primaryResource: 100
    _secondaryResource: 0
  _prerequisite:
    _requiredFilter:
      RequiredLabels: []
      ExcludedLabels: []
    _techBuilding: 0
    _techTier: 0
  _charges:
    _maxNumberOfCharges: 0
    _startingNumberOfCharges: 0
    _chargeCooldownTime: 0
  _deckSlotFlags: 1
  _isUnreleased: 0
  _createUnitAbilityVisualAsset:
    _id: 48
  _unitPreview:
    _id: 6
  _factoryArmyColors:
    _id: 40
  _faction:
    _id: 5
  PreviewFOVOffset: -1.7
  _previewGenerationCameraRotation: {x: 0, y: 0, z: 0, w: 0}
  _previewPoseClip: {fileID: 0}
  PrefabAsset:
    m_AssetGUID: 16970e8a85da8614da64b805233d3d4b
    m_SubObjectName:
    m_SubObjectType:
  Selectable: 1
  Targetable: 1
  SupplyCost: 2
  OverrideGlobalActivationTime: 0
  ActivationTime: 0
  LeaderPriority: 100
  UnitRotationConfig:
    TurnSpeed: 1400
    HasAimingRotation: 0
    AimingTurnSpeed: 1080
    AimingReturnDelay: 1
  _visionRange: 24
  _attributes:
  - _type: 4
    _value: 1200
  - _type: 0
    _value: 8.26
  - _type: 1
    _value: 120
  - _type: 2
    _value: 1.15
  AttackConfig:
    TargetPriorityFiltersKey:
      _id: 11
    TargetAbilityConstraint:
      RequiredFilter:
        RequiredLabels: []
        ExcludedLabels: []
      TargetFilter:
        RequiredLabels:
        - _id: 1
        ExcludedLabels: []
      Range: 8
      ContextualArmyFilterType: 4
      ActivatedArmyFilterType: 4
    Upgrades: []
    AllowWhileMoving: 0
    DeprecatedToBeRemovedSplashDamageRadius: 0
    SelfDestruct: 0
    WarmUpTime: 0
    FiringArc: 1
    ProjectileData:
      ProjectileType:
        _id: 0
      SalvoCount: 1
      Acceleration: 30
      LaunchSpeed: 75
      HomeAbility: 0.5
      VisualRotationFactor: 0.5
      LeadLagFactor: 0
      IgnitionTimer: 0
      Gravity: 9.8
      PreIgnitionLabel:
        _id: 0
    SecondaryWeaponData: []
  _abilities:
  - _id: 12
  - _id: 14
  - _id: 17
  - _id: 88
  _upgrades: []
  _outOfCombatUpgrades: []
  _labels:
  - _id: 1
  - _id: 16
  - _id: 22
  _fowPersistence: 0
  EntityMinimapIcon:
    _id: 1
  MinimapIconSize: 4
  EntitlementKey:
    _id: 94

-----------------------------------------


 * The important data is:
  	
  UnitRadius:
  _healthPercent:
  _primaryResource:
  _techBuilding:
  _techTier:
  _charges:
    _maxNumberOfCharges: 0
    _startingNumberOfCharges: 0
    _chargeCooldownTime: 0
  SupplyCost: 2
  LeaderPriority: 100
  UnitRotationConfig:
    TurnSpeed: 1400
    HasAimingRotation: 0
    AimingTurnSpeed: 1080
    AimingReturnDelay: 1
  _visionRange: 24
  _attributes:
  - _type: 4 
    _value: 1200
  - _type: 0 
    _value: 8.26
  - _type: 1
    _value: 120
  - _type: 2
    _value: 1.15
	  AttackConfig:
    TargetPriorityFiltersKey:
      _id: 11
    TargetAbilityConstraint:
      RequiredFilter:
        RequiredLabels: []
        ExcludedLabels: []
      TargetFilter:
        RequiredLabels:
        - _id: 1
        ExcludedLabels: []
      Range: 8
      ContextualArmyFilterType: 4
      ActivatedArmyFilterType: 4
    AllowWhileMoving: 0
    DeprecatedToBeRemovedSplashDamageRadius: 0
    SelfDestruct: 0
    WarmUpTime: 0
    FiringArc: 1
    ProjectileData:
      ProjectileType:
        _id: 0
      SalvoCount: 1
      Acceleration: 30
      LaunchSpeed: 75
      HomeAbility: 0.5
      VisualRotationFactor: 0.5
      LeadLagFactor: 0
      IgnitionTimer: 0
      Gravity: 9.8
      PreIgnitionLabel:
        _id: 0
    SecondaryWeaponData: []
  _abilities:
  - _id: 12
  - _id: 14
  - _id: 17
  - _id: 88
  MinimapIconSize:

 */

//for each file in unitdefs/ folder
//require fs
var fs = require('fs');
var files = fs.readdirSync('unitdefs/');
var count = 0;

var units = [];

files.forEach(function (file) {
	//read the file
	var fileContents = fs.readFileSync('unitdefs/' + file, 'utf8');
	//get the file name
	var filename = file.split('.')[0];
	//remove 'UnitDefinition_' from the filename (it will always be at the start)
	filename = filename.replace('UnitDefinition_', '');
	//print the file name
	//split the file contents into lines
	var lines = fileContents.split('\n');
	var ignoreUnit = false;

	//if filename contains word
	if (filename.includes('Blocker') || filename.includes('Missile')) {
		ignoreUnit = true;
	}

	lines.forEach(function (line) {
		if (line.includes('_isUnreleased: 1')) {
			//we will ignore this unit
			ignoreUnit = true;
		}
	});
	//if the unit is not ignored, here is where we can loop through line by line and extract the important data

	if (!ignoreUnit) {
		count++;
		console.log(count + '. ' + filename);
		var unit = {};
		unit.name = filename;
		var lineCount = 0;
		lines.forEach(function (line) {
			lineCount++;
			if (line.includes('UnitRadius:')) {
				unit.radius = parseFloat(line.split('UnitRadius: ')[1]);
			}
			if (line.includes('_primaryResource:')) {
				unit.matter = parseFloat(line.split('_primaryResource: ')[1]);
			}
			if (line.includes('_secondaryResource:')) {
				unit.energy = parseFloat(line.split('_secondaryResource: ')[1]);
			}
			if (line.includes('_techBuilding:')) {
				if (unit.techBuilding == undefined) unit.techBuilding = parseFloat(line.split('_techBuilding: ')[1]);
			}
			if (line.includes('_techTier:')) {
				if (unit.techTier == undefined) unit.techTier = parseFloat(line.split('_techTier: ')[1]);
			}
			if (line.includes('SupplyCost:')) {
				unit.supply = parseFloat(line.split('SupplyCost: ')[1]);
			}
			if (line.includes('LeaderPriority:')) {
				unit.priority = parseFloat(line.split('LeaderPriority: ')[1]);
			}
			if (line.includes('TurnSpeed:')) {
				unit.turnSpeed = parseFloat(line.split('TurnSpeed: ')[1]);
			}
			if (line.includes('HasAimingRotation:')) {
				unit.hasAimingRotation = parseFloat(line.split('HasAimingRotation: ')[1]);
			}
			if (line.includes('AimingTurnSpeed:')) {
				unit.aimingTurnSpeed = parseFloat(line.split('AimingTurnSpeed: ')[1]);
			}
			if (line.includes('AimingReturnDelay:')) {
				unit.aimingReturnDelay = parseFloat(line.split('AimingReturnDelay: ')[1]);
			}
			if (line.includes('SelfDestruct:')) {
				unit.selfDestruct = parseFloat(line.split('SelfDestruct: ')[1]);
			}
			if (line.includes('AllowWhileMoving:')) {
				unit.aimingReturnDelay = parseFloat(line.split('AllowWhileMoving: ')[1]);
			}
			if (line.includes('_visionRange:')) {
				unit.vision = parseFloat(line.split('_visionRange: ')[1]);
			}
			if (line.includes('MinimapIconSize:')) {
				unit.minimapIconSize = parseFloat(line.split('MinimapIconSize: ')[1]);
			}
			if (line.includes('_attributes:')) {
				//loop back through the lines and get the following 8 lines after this line
				for (var i = lineCount; i < lineCount + 8; i++) {
					if (lines[i].includes('_type: 0')) {
						unit.speed = parseFloat(lines[i + 1].split('_value: ')[1]);
					}
					if (lines[i].includes('_type: 1')) {
						unit.damage = parseFloat(lines[i + 1].split('_value: ')[1]);
					}
					if (lines[i].includes('_type: 2')) {
						unit.attackSpeed = parseFloat(lines[i + 1].split('_value: ')[1]);
					}
					if (lines[i].includes('_type: 4')) {
						unit.health = parseFloat(lines[i + 1].split('_value: ')[1]);
					}
				}
				//console.log(attributeLines);
			}
		});
		units.push(unit);
	}

	//instead of looping through line by line I'd like to convert the entire file to a table following the formatting rules presented
	//each value in an indented line should be added to the pre
	console.log(units);
	//save units as a json file
	fs.writeFileSync('units.json', JSON.stringify(units, null, 2));
});
