module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectEhuftzMasterList":
			_SQLCommand += "WITH EHUFTZ_MASTER_LIST1 AS ( \
							SELECT * \
							FROM ( \
								SELECT *, \
									CASE WHEN IL_MERGENO IS NULL THEN IL_BAGNO2 ELSE IL_MERGENO END AS IL_BAGNO2_OR_MERGENO \
								FROM V_ITEM_LIST_FOR_D \
								WHERE IL_SEQ = @EML_SEQ \
							) ITEM_LIST \
							INNER JOIN ( \
								SELECT *, \
									( \
										SELECT SC_DESC \
										FROM SYS_CODE \
										WHERE SC_TYPE = 'ClearanceType' \
										AND SC_CODE = EML_TRUE_CLEARANCE \
										AND SC_STS = 0 \
									) AS EML_TRUE_CLEARANCE_STR \
								FROM EHUFTZ_MASTER_LIST \
								WHERE EML_SEQ = @EML_SEQ \
							) A ON A.EML_SEQ = IL_SEQ AND A.EML_HWB = IL_BAGNO2_OR_MERGENO \
							UNION \
							SELECT * \
							FROM ( \
								SELECT *, \
									CASE WHEN IL_MERGENO IS NULL THEN IL_BAGNO2 ELSE IL_MERGENO END AS IL_BAGNO2_OR_MERGENO \
								FROM V_ITEM_LIST_FOR_D \
								WHERE IL_SEQ = @EML_SEQ \
							) ITEM_LIST \
							INNER JOIN ( \
								SELECT *, \
									( \
										SELECT SC_DESC \
										FROM SYS_CODE \
										WHERE SC_TYPE = 'ClearanceType' \
										AND SC_CODE = EML_TRUE_CLEARANCE \
										AND SC_STS = 0 \
									) AS EML_TRUE_CLEARANCE_STR \
								FROM EHUFTZ_MASTER_LIST \
								WHERE EML_SEQ = @EML_SEQ \
							) B ON B.EML_SEQ = IL_SEQ AND B.EML_EXP_BAGNO = IL_BAGNO2_OR_MERGENO AND B.EML_HWB = IL_SMALLNO2 \
						), CUSTOMS_CLEARANCE1 AS ( \
							SELECT *, \
								( \
									SELECT SC_DESC \
									FROM SYS_CODE \
									WHERE SC_TYPE = 'ClearanceType' \
									AND SC_CODE = CC_CUST_CLEARANCE \
									AND SC_STS = 0 \
								) AS CC_CUST_CLEARANCE_STR \
							FROM CUSTOMS_CLEARANCE \
							WHERE CC_SEQ = @EML_SEQ \
						) \
						SELECT *, \
							CASE WHEN IL_BAGNO2Index != 1 AND (IL_G1 = 'G1' OR IL_MERGENO IS NOT NULL) THEN NULL ELSE EML_PIECE END AS EML_PIECE_NOREPEAT, \
							CASE WHEN IL_BAGNO2Index != 1 AND (IL_G1 = 'G1' OR IL_MERGENO IS NOT NULL) THEN NULL ELSE EML_GCI_PIECE END AS EML_GCI_PIECE_NOREPEAT, \
							CASE WHEN IL_BAGNO2Index != 1 AND (IL_G1 = 'G1' OR IL_MERGENO IS NOT NULL) THEN NULL ELSE EML_GCO_PIECE END AS EML_GCO_PIECE_NOREPEAT, \
							CASE WHEN IL_BAGNO2Index != 1 AND (IL_G1 = 'G1' OR IL_MERGENO IS NOT NULL) THEN NULL ELSE EML_WEIGHT END AS EML_WEIGHT_NOREPEAT, \
							CASE WHEN IL_BAGNO2Index != 1 AND (IL_G1 = 'G1' OR IL_MERGENO IS NOT NULL) THEN NULL ELSE EML_GCI_WEIGHT END AS EML_GCI_WEIGHT_NOREPEAT, \
							CASE WHEN IL_BAGNO2Index != 1 AND (IL_G1 = 'G1' OR IL_MERGENO IS NOT NULL) THEN NULL ELSE EML_BAG_WEIGHT END AS EML_BAG_WEIGHT_NOREPEAT, \
							CASE WHEN IL_BAGNO2Index != 1 AND (IL_G1 = 'G1' OR IL_MERGENO IS NOT NULL) THEN NULL ELSE EML_BAG_FEE END AS EML_BAG_FEE_NOREPEAT \
						FROM ( \
							SELECT ITEM_LIST.IL_SEQ, \
								ITEM_LIST.IL_NEWBAGNO, \
								ITEM_LIST.IL_NEWSMALLNO, \
								ITEM_LIST.IL_ORDERINDEX, \
								ITEM_LIST.IL_BAGNO,\
								ITEM_LIST.IL_BAGNO2, \
								ITEM_LIST.IL_SMALLNO2, \
								IL_BAGNO2Index, \
								ITEM_LIST.IL_G1, \
								ITEM_LIST.IL_MERGENO, \
								EHUFTZ_MASTER_LIST1.EML_SEQ, \
								EHUFTZ_MASTER_LIST1.EML_SORT_KEY, \
								EHUFTZ_MASTER_LIST1.EML_DECL_NO, \
								EHUFTZ_MASTER_LIST1.EML_DECL_TYPE, \
								EHUFTZ_MASTER_LIST1.EML_EXP_BAGNO, \
								EHUFTZ_MASTER_LIST1.EML_HWB, \
								EHUFTZ_MASTER_LIST1.EML_CLEARANCE_TYPE, \
								EHUFTZ_MASTER_LIST1.EML_PIECE, \
								EHUFTZ_MASTER_LIST1.EML_GCI_PIECE, \
								EHUFTZ_MASTER_LIST1.EML_GCO_PIECE, \
								EHUFTZ_MASTER_LIST1.EML_WEIGHT, \
								EHUFTZ_MASTER_LIST1.EML_GCI_WEIGHT, \
								EHUFTZ_MASTER_LIST1.EML_BAG_WEIGHT, \
								EHUFTZ_MASTER_LIST1.EML_BAG_FEE, \
								EHUFTZ_MASTER_LIST1.EML_FLIGHT_NO, \
								EHUFTZ_MASTER_LIST1.EML_FLIGHT_DATE, \
								EHUFTZ_MASTER_LIST1.EML_GCI_DATE1, \
								EHUFTZ_MASTER_LIST1.EML_GCO_DATE1, \
								EHUFTZ_MASTER_LIST1.EML_RELEASE_TIME, \
								EHUFTZ_MASTER_LIST1.EML_ACCOUNT, \
								EHUFTZ_MASTER_LIST1.EML_UP_DATETIME, \
								EHUFTZ_MASTER_LIST1.EML_TRUE_CLEARANCE, \
								EHUFTZ_MASTER_LIST1.EML_TRUE_CLEARANCE_STR, \
								CASE WHEN IL_BAGNO2Index = 1 \
								THEN ITEM_LIST.IL_BAGNO2 ELSE NULL END AS 'IL_BAGNO2_NOREPEAT', \
								CC_CUST_CLEARANCE, \
								CC_CUST_CLEARANCE_STR, \
								CC_CUST_DESC, \
								CC_ORI_DESC, \
								CC_CR_USER, \
								( \
									SELECT U_NAME \
									FROM USER_INFO \
									WHERE U_ID = CASE WHEN CC_CR_USER IS NOT NULL THEN CC_CR_USER ELSE CC_UP_USER END \
								) AS U_NAME, \
								CASE WHEN CC_CR_DATETIME IS NOT NULL THEN CC_CR_DATETIME ELSE CC_UP_DATETIME END AS CC_DATETIME \
							FROM ( \
								SELECT *, \
									ROW_NUMBER() OVER(PARTITION BY CASE WHEN IL_MERGENO IS NULL THEN IL_BAGNO2 ELSE IL_MERGENO END ORDER BY IL_BAGNO2) AS IL_BAGNO2Index \
								FROM V_ITEM_LIST_FOR_D \
								WHERE IL_SEQ = @EML_SEQ \
							) ITEM_LIST \
							LEFT JOIN ( \
								SELECT * \
								FROM PULL_GOODS \
								WHERE PG_SEQ = @EML_SEQ \
							) PULL_GOODS ON \
							IL_SEQ = PG_SEQ AND \
							IL_BAGNO = PG_BAGNO \
							LEFT JOIN CUSTOMS_CLEARANCE1 ON CC_SEQ = IL_SEQ \
							AND CC_NEWBAGNO = IL_NEWBAGNO \
							AND CC_NEWSMALLNO = IL_NEWSMALLNO \
							AND CC_ORDERINDEX = IL_ORDERINDEX \
							LEFT JOIN EHUFTZ_MASTER_LIST1 ON EHUFTZ_MASTER_LIST1.IL_SEQ = ITEM_LIST.IL_SEQ \
							AND EHUFTZ_MASTER_LIST1.IL_NEWBAGNO = ITEM_LIST.IL_NEWBAGNO \
							AND EHUFTZ_MASTER_LIST1.IL_NEWSMALLNO = ITEM_LIST.IL_NEWSMALLNO \
							AND EHUFTZ_MASTER_LIST1.IL_ORDERINDEX = ITEM_LIST.IL_ORDERINDEX \
							WHERE /*沒被拉貨的*/ PG_SEQ IS NULL \
						) A \
						ORDER BY CASE WHEN IL_MERGENO IS NULL THEN IL_BAGNO2 ELSE IL_MERGENO END ASC, EML_TRUE_CLEARANCE DESC, IL_BAGNO2Index ASC";
				
			break;

	}

	return _SQLCommand;
};