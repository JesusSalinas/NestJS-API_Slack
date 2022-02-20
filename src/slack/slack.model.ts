export class slack_header {
  slack = {
    type: 'header',
    text: {
      type: 'plain_text',
      text: '',
    },
  };
}
export class slack_input_option {
  slack = {
    text: {
      type: 'plain_text',
      text: '',
      emoji: true,
    },
    value: '',
  };
}
export class slack_input_modal {
  slack = {
    type: 'input',
    block_id: '',
    element: {
      type: 'static_select',
      placeholder: {
        type: 'plain_text',
        text: 'Select an option',
        emoji: true,
      },
      options: [],
      action_id: '',
    },
    label: {
      type: 'plain_text',
      text: '',
      emoji: true,
    },
  };
}
export class slack_select_conversation {
  slack = {
    type: 'input',
    element: {
      type: 'conversations_select',
      placeholder: {
        type: 'plain_text',
        text: 'Select an option',
      },
      action_id: 'selects',
      default_to_current_conversation: true,
    },
    label: {
      type: 'plain_text',
      text: '',
      emoji: true,
    },
  };
}
export class slack_modal {
  slack = {
    trigger_id: '',
    view: {
      type: 'modal',
      callback_id: '',
      notify_on_close: true,
      private_metadata: '',
      title: {
        type: 'plain_text',
        text: '',
      },
      submit: {
        type: 'plain_text',
        text: 'Submit',
        emoji: true,
      },
      close: {
        type: 'plain_text',
        text: 'Cancel',
        emoji: true,
      },
      blocks: [],
    },
  };
}
export class slack_message {
  slack = {
    response_type: 'ephemeral',
    blocks: [],
    attachments: [
      {
        color: '',
        blocks: [],
      },
    ],
  };
}
export class slack_section {
  slack = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: '',
    },
  };
}
