#include <windows.h>

DWORD WINAPI run_command(LPVOID lpParam) {
    system((char *)lpParam);
    return 0;
}

int main() {
    const char *fastapi = "call env\\Scripts\\activate && cd backend && uvicorn app.main:app --reload";
    const char *webpack = "cd frontend && npx webpack --watch";

    HANDLE thread1 = CreateThread(NULL, 0, run_command, (LPVOID)fastapi, 0, NULL);
    HANDLE thread2 = CreateThread(NULL, 0, run_command, (LPVOID)webpack, 0, NULL);

    // Wait for both threads to finish
    WaitForSingleObject(thread1, INFINITE);
    WaitForSingleObject(thread2, INFINITE);

    // Clean up thread handles
    CloseHandle(thread1);
    CloseHandle(thread2);

    return 0;
}
