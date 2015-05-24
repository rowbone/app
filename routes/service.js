
var express = require('express');
var router = express.Router();
var fs = require('fs');

router.post('/orgUnit!queryOrgUnitInfoInCam?', 
	function(req, res) {
console.log(req.param('ID'));
		var strFile = './app/data/bz/home/contactlist2/orgUnit-queryOrgUnitInfoInCam-id-1421924106089631410343354.json';
		fs.readFile(strFile, 'utf8', function(err, data) {
			if(err) throw err;
			res.send(data);
		});
	});

router.post('/followItem!queryFollowItemByFollowType', 
	function(req, res) {
		// 
		var followType = req.param('FOLLOW_TYPE');
		console.log('type-->', followType);
		var strFile = '';
		if(followType == undefined || followType === '') {
			strFile = 'app/data/bz/home/contactlist2/collections-org-staff.json';
			fs.readFile(strFile, 'utf8', function(err, data) {
				if(err) throw err;
				res.send(data);
			});
		}
	});

router.post('/orgUnit!queryNextContactTreeById', 
	function(req, res) {
		var orgId = req.param('ORG_ID');
console.log('nect contact tree, orgId -->', orgId);		
		var strFile = 'app/data/bz/home/contactlist2/orgUnit-queryNextContactTreeById.json'

		fs.readFile(strFile, 'utf8', function(err, data) {
			if(err)	throw err;
			res.send(data);
		});
	});

router.post('/staffInfo!queryActStaffByOrgUnitId', 
	function(req, res) {
		var orgUnitId = req.param('ORG_UNIT_ID');
console.log('orgUnitId-->', orgUnitId);
		var strFile = 'app/data/bz/home/contactlist2/staffInfo-queryActStaffByOrgUnitId.json';
		fs.readFile(strFile, 'utf8', function(err, data){
			if(err)	throw err;

			res.send(data);
		});
	});

// 个人信息
router.post('/staffInfo!queryStaffInfoAndTotalnameAndJobs', 
	function(req, res) {
		var staffId = req.param('ID');
		console.log('staffId-->', staffId);
		var strFile = 'app/data/bz/home/contactlist2/staffInfo-queryStaffInfoAndTotalnameAndJobs-ID-1422945768950299610293279.json';

		fs.readFile(strFile, 'utf8', function(err, data) {
			if(err) throw err;

			res.send(data);
		})
	})

// 关注
router.post('/followItem!saveEntity', 
	function(req, res) {
		var followType = req.param('FOLLOW_TYPE');
console.log('followType-->', followType);
		var strFile = 'app/data/bz/home/contactlist2/collections-org-staff.json';

		fs.readFile(strFile, 'utf8', function(err, data) {
			if(err) throw err;

			res.send(data);
		})
	});

// 取消关注
router.post('/followItem!deleteEntity', 
	function(req, res) {
		var staffId = req.param('ID');
console.log('unFollowId-->', staffId);
		var strFile = 'app/data/bz/home/contactlist2/collections-org-staff.json';

		fs.readFile(strFile, 'utf8', function(err, data) {
			if(err) throw err;

			data = JSON.parse(data);
			var followedOrgs = data.obj.orgFollowItem;
			var followedStaffs = data.obj.staffFollowItem;

			res.send(data);
		})
	});

router.post('/staffInfo!queryStaffInfoByNameByPage', 
	function(req, res) {
		console.log('NAME-->', req.param('NAME'));
		var strFile = 'app/data/bz/home/contactlist2/staffInfo-queryStaffInfoByNameByPage.json';

		fs.readFile(strFile, 'utf8', function(err, data) {
			if(err)	throw err;

			res.send(data);
		});
	})

router.post('/staffInfo!queryStaffListByResume', 
	function(req, res) {
		console.log('RESUME-->', req.param('RESUME'));
		var strFile = 'app/data/bz/home/contactlist2/staffInfo-queryStaffInfoByNameByPage.json';

		fs.readFile(strFile, 'utf8', function(err, data) {
			if(err)	throw err;

			res.send(data);
		});
	})

// 区域
router.post('/orgUnit!query12BranchCourts', function(req, res) {
	var strFile = 'app/data/bz/home/contactlist2/orgUnit-query12BranchCourts.json';

	fs.readFile(strFile, 'utf8', function(err, data) {
		if(err)	throw err;

		res.send(data);
	});
});

// 分类
router.post('/common!queryOptions', function(req, res) {
	var strFile = 'app/data/bz/home/contactlist2/common-queryOptions-type-DICT_OPTION-DICT_CODE-HR_ORG_CLASS.json';

	fs.readFile(strFile, 'utf8', function(err, data) {
		if(err)	throw err;

		res.send(data);
	});
});

// 获取所有组织
router.post('/orgUnit!queryAcademicAllOrg', function(req, res) {
	var strFile = 'app/data/bz/home/contactlist2/orgUnit-queryListOrgByNameOrShortNameByPage.json';

	fs.readFile(strFile, 'utf8', function(err, data) {
		if(err)	throw err;

		res.send(data);
	});
});

module.exports = router;