import React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import classes from '../../../../styles/alertDialog.module.scss';
import instance from 'lib/axios';
import { toast } from 'react-toastify';
import { getCookie } from '@utils/common/storage/cookie/document';

const AlertDialogComponent = (props) => {


  const deleteAccount = async () => {
    try {
      let accessToken = getCookie('user-access-token')
      accessToken = JSON.parse(accessToken).accessToken
      const response = await instance.delete(`/admin/${props.adminId}`, {
        headers: {
          'Authorization': accessToken
        }
      })
      if (response.data) {
        props.setAdmins(response.data.admins)
        return toast.success(response.data.message)
      }
    } catch (error) {
      if (error.response) {
        if (!error.response.data.success) {
          return toast.warn(error.response.data.message)
        }
      }
    }
  }

  return (

    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        {props.children}
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={classes.AlertDialogOverlay} />
        <AlertDialog.Content className={classes.AlertDialogContent}>
          <AlertDialog.Title className={classes.AlertDialogTitle}>Are you absolutely sure?</AlertDialog.Title>
          <AlertDialog.Description className={classes.AlertDialogDescription}>
            This action cannot be undone. This will permanently delete the account and remove
            data from our servers.
          </AlertDialog.Description>
          <div style={{ display: 'flex', gap: 25, justifyContent: 'flex-end' }}>
            <AlertDialog.Cancel asChild>
              <button className={classes.Button + ' ' + classes.mauve}>Cancel</button>
            </AlertDialog.Cancel>
            <AlertDialog.Action onClick={deleteAccount} asChild>
              <button className={classes.Button + ' ' + classes.red}>Yes, delete account</button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

export default AlertDialogComponent;