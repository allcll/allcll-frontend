import { Button, Checkbox, Dialog, Flex, SupportingText } from '@allcll/allcll-ui';
import { useState } from 'react';
import ImportSvg from '@/assets/important.svg?react';

interface ILoginConfirmationDialog {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

function LoginConfirmationDialog({ isOpen, onClose, onConfirm, isPending }: ILoginConfirmationDialog) {
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);

  const handleConfirm = () => {
    if (doNotShowAgain) {
      localStorage.setItem('hideLoginConfirmDialog', 'true');
    }
    onConfirm();
  };

  return (
    <Dialog isOpen={isOpen} title="로그인 확인" onClose={onClose}>
      <Dialog.Content>
        <Flex direction="flex-col" align="items-center" gap="gap-4" className="py-4 min-w-[250px] px-6">
          <ImportSvg className="w-12 h-12 mx-auto" />
          <p className="font-semibold text-gray-800 text-lg">학사정보시스템 로그아웃 안내</p>
          <SupportingText className="text-center">
            ALLCLL 로그인 시 <span className="text-secondary-500 font-semibold">학사정보시스템에서 로그아웃</span>
            됩니다.
            <br />
            진행중인 작업이 있다면 완료 후 로그인해주시기 바랍니다.
            <br />
            계속해서 로그인을 진행하시겠습니까?
          </SupportingText>
        </Flex>
      </Dialog.Content>

      <Dialog.Footer>
        <Flex gap="gap-6" justify="justify-between">
          <Checkbox
            label="다시 보지 않기"
            name="doNotShowAgain"
            checked={doNotShowAgain}
            onChange={e => setDoNotShowAgain(e.target.checked)}
          />
          <Flex gap="gap-2">
            <Button variant="primary" size="medium" onClick={handleConfirm} disabled={isPending}>
              {isPending ? '로그인 중...' : '계속 로그인'}
            </Button>
          </Flex>
        </Flex>
      </Dialog.Footer>
    </Dialog>
  );
}

export default LoginConfirmationDialog;
