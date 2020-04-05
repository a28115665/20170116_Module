module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectEhuftzMasterList":
			_SQLCommand += "SELECT *, \
								CASE WHEN EML_DECL_TYPEIndex != 1 AND EML_DECL_TYPE = '' THEN NULL ELSE EML_PIECE END AS EML_PIECE_NOREPEAT, \
								CASE WHEN EML_DECL_TYPEIndex != 1 AND EML_DECL_TYPE = '' THEN NULL ELSE EML_GCI_PIECE END AS EML_GCI_PIECE_NOREPEAT, \
								CASE WHEN EML_DECL_TYPEIndex != 1 AND EML_DECL_TYPE = '' THEN NULL ELSE EML_GCO_PIECE END AS EML_GCO_PIECE_NOREPEAT, \
								CASE WHEN EML_DECL_TYPEIndex != 1 AND EML_DECL_TYPE = '' THEN NULL ELSE EML_WEIGHT END AS EML_WEIGHT_NOREPEAT, \
								CASE WHEN EML_DECL_TYPEIndex != 1 AND EML_DECL_TYPE = '' THEN NULL ELSE EML_GCI_WEIGHT END AS EML_GCI_WEIGHT_NOREPEAT, \
								CASE WHEN EML_DECL_TYPEIndex != 1 AND EML_DECL_TYPE = '' THEN NULL ELSE EML_BAG_WEIGHT END AS EML_BAG_WEIGHT_NOREPEAT, \
								CASE WHEN EML_DECL_TYPEIndex != 1 AND EML_DECL_TYPE = '' THEN NULL ELSE EML_BAG_FEE END AS EML_BAG_FEE_NOREPEAT \
							FROM ( \
								SELECT IL_SEQ, \
									IL_NEWBAGNO, \
									IL_NEWSMALLNO, \
									IL_ORDERINDEX, \
									IL_BAGNO,\
									IL_BAGNO2, \
									IL_SMALLNO2, \
									IL_BAGNO2Index,\
									EHUFTZ_MASTER_LIST1.*, \
									CASE WHEN IL_BAGNO2Index = 1 \
									THEN IL_BAGNO2 ELSE NULL END AS 'IL_BAGNO2_NOREPEAT', \
									ROW_NUMBER() OVER(PARTITION BY EML_DECL_TYPE ORDER BY EML_DECL_TYPE) AS EML_DECL_TYPEIndex, \
									CC_CUST_CLEARANCE, \
									CC_CUST_CLEARANCE_STR, \
									CC_CUST_DESC, \
									CC_ORI_DESC, \
									CC_CR_USER \
								FROM ( \
									SELECT *,\
										ROW_NUMBER() OVER(PARTITION BY IL_BAGNO2 ORDER BY IL_BAGNO2) AS IL_BAGNO2Index\
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
								INNER JOIN ( \
									SELECT *, \
										( \
											SELECT SC_DESC \
											FROM SYS_CODE \
											WHERE SC_TYPE = 'ClearanceType' \
											AND SC_CODE = EML_TRUE_CLEARANCE \
											AND SC_STS = 0 \
										) AS EML_TRUE_CLEARANCE_STR \
									FROM EHUFTZ_MASTER_LIST B \
									WHERE EML_SEQ = @EML_SEQ \
								) EHUFTZ_MASTER_LIST1 ON EHUFTZ_MASTER_LIST1.EML_SEQ = IL_SEQ AND EHUFTZ_MASTER_LIST1.EML_HWB = IL_BAGNO2 \
								LEFT JOIN ( \
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
								) CUSTOMS_CLEARANCE ON CC_SEQ = IL_SEQ \
								AND CC_NEWBAGNO = IL_NEWBAGNO \
								AND CC_NEWSMALLNO = IL_NEWSMALLNO \
								AND CC_ORDERINDEX = IL_ORDERINDEX \
								WHERE /*沒被拉貨的*/ PG_SEQ IS NULL \
								UNION\
								SELECT IL_SEQ, \
									IL_NEWBAGNO, \
									IL_NEWSMALLNO, \
									IL_ORDERINDEX, \
									IL_BAGNO,\
									IL_BAGNO2, \
									IL_SMALLNO2, \
									IL_BAGNO2Index,\
									EHUFTZ_MASTER_LIST2.*, \
									CASE WHEN IL_BAGNO2Index = 1 \
									THEN IL_BAGNO2 ELSE NULL END AS 'IL_BAGNO2_NOREPEAT', \
									ROW_NUMBER() OVER(PARTITION BY EML_DECL_TYPE ORDER BY EML_DECL_TYPE) AS EML_DECL_TYPEIndex, \
									CC_CUST_CLEARANCE, \
									CC_CUST_CLEARANCE_STR, \
									CC_CUST_DESC, \
									CC_ORI_DESC, \
									CC_CR_USER \
								FROM ( \
									SELECT *,\
										ROW_NUMBER() OVER(PARTITION BY IL_BAGNO2 ORDER BY IL_BAGNO2) AS IL_BAGNO2Index \
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
								INNER JOIN ( \
									SELECT *, \
										( \
											SELECT SC_DESC \
											FROM SYS_CODE \
											WHERE SC_TYPE = 'ClearanceType' \
											AND SC_CODE = EML_TRUE_CLEARANCE \
											AND SC_STS = 0 \
										) AS EML_TRUE_CLEARANCE_STR \
									FROM EHUFTZ_MASTER_LIST B \
									WHERE EML_SEQ = @EML_SEQ \
								) EHUFTZ_MASTER_LIST2 ON EHUFTZ_MASTER_LIST2.EML_SEQ = IL_SEQ AND EHUFTZ_MASTER_LIST2.EML_EXP_BAGNO = IL_BAGNO2 AND EHUFTZ_MASTER_LIST2.EML_HWB = IL_SMALLNO2 \
								LEFT JOIN ( \
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
								) CUSTOMS_CLEARANCE ON CC_SEQ = IL_SEQ \
								AND CC_NEWBAGNO = IL_NEWBAGNO \
								AND CC_NEWSMALLNO = IL_NEWSMALLNO \
								AND CC_ORDERINDEX = IL_ORDERINDEX \
								WHERE /*沒被拉貨的*/ PG_SEQ IS NULL \
							) A \
							ORDER BY EML_TRUE_CLEARANCE DESC, IL_BAGNO2 ASC, IL_BAGNO2Index ASC";
				
			break;

	}

	return _SQLCommand;
};