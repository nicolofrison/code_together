import { useContext, useEffect, useState } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import CodeHistory from '../../models/interfaces/codeHistory.interface';

import CodeHistoryService from '../../services/codeHistory.service';
import { CodeHistoryContext } from '../contexts/CodeHistoryContext';
import { Button, Divider, Grid, Paper, Stack } from '@mui/material';
import handleError from '../../utils/errorHandler';
import { AxiosError } from 'axios';
import AlertService from '../../services/alert.service';
import { AlertType } from '../Utils/TopAlert';
import ConfirmDialog from '../Utils/ConfirmationDialog';

const alertService = AlertService.getInstance();
const codeHistoryService = CodeHistoryService.getInstance();

export default function CodeHistoryList() {
  const { codeId, updateCodeHistoryList } = useContext(CodeHistoryContext);

  const [codeHistories, setCodeHistories] = useState([] as CodeHistory[]);
  const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] =
    useState(false);

  const updateCodeHistories = async () => {
    if (codeId.get > 0) {
      codeHistoryService.getAllByCodeId(codeId.get).then((list) => {
        setCodeHistories(list);
      });
    } else {
      setCodeHistories([]);
    }
  };

  const deleteLastCommit = async () => {
    const lastCommitId = codeHistories[0].id;

    try {
      await codeHistoryService.deleteById(lastCommitId);

      await updateCodeHistories();

      alertService.showAlert(
        'Last commit deleted successfully',
        AlertType.success
      );
    } catch (e) {
      handleError(e as Error | AxiosError);
    } finally {
      setIsDeleteConfirmationDialogOpen(false);
    }
  };

  useEffect(() => {
    updateCodeHistories();
  }, [updateCodeHistoryList.get, codeId.get]);

  useEffect(
    () => () => {
      console.log('cleaned up');
      codeId.set(-1);
    },
    []
  );

  return (
    <>
      {codeHistories.length > 0 ? (
        <>
          <ConfirmDialog
            open={isDeleteConfirmationDialogOpen}
            onClose={() => setIsDeleteConfirmationDialogOpen(false)}
            title="Confirm delete of last commit"
            content={`Do you confirm the delete of the last commit dialog '${codeHistories[0].comment}' ?`}
            onConfirm={() => deleteLastCommit()}
          />
          <Grid container style={{ height: '100%', overflowY: 'auto' }}>
            <Stack width="100%">
              <Button
                variant="contained"
                color="error"
                onClick={() => setIsDeleteConfirmationDialogOpen(true)}
              >
                Delete last commit
              </Button>
              <Divider />
              {codeHistories.map((ch) => (
                <div key={ch.id}>
                  <Paper>
                    <p>
                      <b>{ch.comment}</b>
                    </p>
                    <p>{ch.timestamp.toString()}</p>
                  </Paper>
                  <Divider />
                </div>
              ))}
            </Stack>
          </Grid>
        </>
      ) : (
        <p>The repository is empty</p>
      )}
    </>
  );
}
