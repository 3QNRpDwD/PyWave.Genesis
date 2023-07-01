import socket
from urllib import parse
from .Thread_Manager import *
from .Structure import *
from .Log_Manager import *

class HyperTextTransferProtocol:
    def __init__(self):
        self.head = bytes()
        self.recv_datas = bytes()
        self.s = socket.socket()
        self.Thread=Thread()
        self.log=Log().logging
        self.Content_Length=''

    def get(self, url: str, port: int = 80, params: dict = None):
        try:
            self.s.connect((url, port))
            headers = PrepareHeader()._prepare_request_headers('GET', url, params)
            self.s.send(headers.encode())
            return self.Receive()
        except ConnectionRefusedError as e:
            print(f'Request to server failed... Reason: {e}')
        finally:
            self.s.close()

    def BindAddress(self, address='0.0.0.0', port=80):
        #external_ip = request.urlopen('https://ident.me').read().decode('utf8')  
        self.s.bind((address, port))
        self.log(f"[ Server started on ] ==> ip/port : \033[94m:{port}\033[0m")

    def listen(self, limit=0):
        self.s.listen(limit)

    def AcceptConnection(self):
        self.c, self.addr = self.s.accept()
        self.log(msg=f"[ Connected with ] ==> address : \033[32m{self.addr}\033[0m")
        return self.c, self.addr
    
    def receive(self,socket=None, address=None, max_recv_size=1):
        received_data = self.receive_data(socket, max_recv_size)
        header_list = self.parse_header(received_data)
        first_header=header_list[0]
        if 'POST' in header_list[0]:
            post_body = self.receive_post_body(socket, header_list)
            self.log(f"[ {first_header} request from] ==> address : \033[33m{address}\033[0m")
            return header_list, post_body

        self.log(f"[ {first_header} request from] ==> address : \033[33m{address}\033[0m")
        return header_list

    def receive_data(self,socket, max_recv_size):
        received_data = b''
        sokt = self.get_socket(socket[0])
        while b'\r\n\r\n' not in received_data:
            received_data += sokt.recv(max_recv_size)
        return received_data


    def get_socket(self,socket):
        return socket if socket is not None else self.c


    def parse_header(self,received_data):
        return parse.unquote(received_data).split('\r\n')


    def receive_post_body(self,socket, header_list):
        post_body = b''
        max_buf_size = self.extract_post_body_size(header_list)
        buf_size = 2048
        while True:
            post_body += socket[0].recv(buf_size)
            if max_buf_size == len(post_body):
                break
            buf_size = buf_size * 2
        return post_body

    def extract_post_body_size(self,header):
        content_length_header = next((header for header in header if 'Content-Length' in header), None)
        if content_length_header:
            content_length_str = ''.join(filter(str.isdigit, content_length_header))
            return int(content_length_str)
        return 0

    def AssignUserThread(self,socket_and_addres):
        thread_name,thread = self.Thread.ThreadConstructor(target=self.receive,args=socket_and_addres)
        self.Thread.USERS.append(socket_and_addres[1])
        self.Thread.USERS_COUNT+=1
        self.Thread.ThreadSessions[thread_name]=socket_and_addres[1]
        self.Thread.user_socket_dict[socket_and_addres[1]]=socket_and_addres[0]
        return thread_name,thread

    def SendResponse(self,Response,socket_and_addres):
        addr = f'\033[31m{socket_and_addres[1]}\033[0m'
        socket_and_addres[0][0].send(Response)
        socket_and_addres[0][0].close()
        self.log(msg=f'[ Disconnected from ] ==> address : {addr}')
        self.Thread.finished_users.append(socket_and_addres[1])
